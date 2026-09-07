"""Rebuild the local catalog from the supplied, unmodified workbook and PDF.
Run with the bundled Python runtime (openpyxl, pypdf). Editorial content lives in course-content.json.
"""
import json, re, pathlib, unicodedata
import openpyxl
from pypdf import PdfReader
ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / 'lib/data'
DATA.mkdir(parents=True, exist_ok=True)
wb = openpyxl.load_workbook(ROOT / 'ISE Chart Analysis.xlsx', read_only=True, data_only=True)
pdf = next(ROOT.glob('*.pdf'))
cache = ROOT / 'tmp/pdf-pages.json'
pages = json.loads(cache.read_text(encoding='utf8')) if cache.exists() else [p.extract_text() or '' for p in PdfReader(pdf).pages]
def norm(s):
    return re.sub(r'[\W_]+', '', str(s).translate(str.maketrans('يك۰۱۲۳۴۵۶۷۸۹', 'یک0123456789'))).lower()
def text(en, fa): return dict(en=en, fa=fa)
page_map = {}
for i, p in enumerate(pages):
    match = re.search(r'(?:ISE|SCI)-\d+', p[:450])
    if match and ('عنوان درس' in p[:300]): page_map[match[0]] = i + 1
editorial = {}
for line in (ROOT/'scripts/course-content.tsv').read_text(encoding='utf8').splitlines():
    if not line.strip(): continue
    code,en,fa,topic = line.split('|')
    editorial[code] = {'description':text(en,fa),'wikiTopic':topic}
courses = []
sheet = wb['ISE Chart (New Edition)']
def add(row, col, group, code, en=None):
    fa = sheet.cell(row,col).value
    eng = en or sheet.cell(row,col+1).value
    credit_col = col + (1 if col == 16 else 2)
    value = sheet.cell(row,credit_col).value
    source = {'file':'workbook', 'sheet':sheet.title, 'range':f'{openpyxl.utils.get_column_letter(col)}{row}:{openpyxl.utils.get_column_letter(credit_col)}{row}'}
    sources = [source]
    page = page_map.get(code)
    if page: sources.append({'file':'curriculum', 'page':page})
    if not isinstance(value,(int,float)):
        # The official elective overview (PDF pp.17–18) fills workbook dashes.
        value = {133:2,134:3,143:1,144:1,146:3,147:3,148:2,149:3,150:3,151:3,152:3,154:2,155:3,156:2,157:2,158:1,159:1,161:3}[int(code.split('-')[1])]
        sources.append({'file':'curriculum','page':17 if int(code.split('-')[1]) < 153 else 18,'field':'credits'})
    item = {'id':code.lower(), 'code':code if not code.startswith('GEN') else None, 'name':text(eng,fa), 'credits':int(value), 'group':group,'categories':[], 'pathwayIds':[], 'sources':sources}
    item.update(editorial[code])
    courses.append(item)
for row in range(2,14): add(row,4,'general',f'GEN-{row-1:03}')
for row,code in zip(range(18,26),[101,102,103,104,106,114,115,116]): add(row,4,'foundation',f'SCI-{code}')
for row in range(2,28): add(row,8,'mandatory',f'ISE-{row+99}')
for row,code in zip(range(2,33),list(range(131,160))+[161,162]): add(row,12,'elective',f'ISE-{code}')
for row,en in [(2,'Technology, Innovation and Entrepreneurship Management'),(3,'Internship'),(4,'Professional Soft Skills')]: add(row,16,'employability',f'ISE-{row+126}',en)
add(9,16,'project','ISE-127','Undergraduate Project')
by_id = {c['id']:c for c in courses}
membership = {
 'finance':['ise-101','ise-102','ise-103','ise-113','ise-142'],
 'management':['ise-103','ise-104','ise-111'],
 'core':['ise-105','ise-106','ise-107','ise-115','ise-116','ise-121','ise-124','ise-131','ise-132','ise-135','ise-136','ise-138','ise-141','ise-153','ise-162'],
 'math':['sci-101','sci-102','sci-103','sci-104','sci-115','ise-118','ise-108','ise-109','ise-110','ise-117','ise-139'],
 'programming':['sci-114','ise-119','ise-122','ise-140','ise-145'],
 'other':['sci-106','sci-116','ise-112','ise-114','ise-120','ise-125','ise-126'],
}
for cat,ids in membership.items():
    for id in ids: by_id[id]['categories'].append(cat)
pathway_specs=[('optimization',1,3,11,2),('healthcare',1,16,18,2),('logistics',1,23,25,2),('data-ai',1,30,36,2),('quality',6,3,9,7),('finance',6,14,16,7),('hse',6,21,23,7),('feasibility',6,28,31,7),('research',11,3,4,12),('common',11,9,17,12)]
pathway_content=json.loads((ROOT/'scripts/pathway-content.json').read_text(encoding='utf8'))
masters=wb['Master Majors']
by_name={norm(c['name']['fa']):c for c in courses}
pathways=[]
for id,header_col,start,end,col in pathway_specs:
    record={'id':id,'courseIds':[], 'supporting':id in ['feasibility','research','common'],**pathway_content[id]}
    for row in range(start,end+1):
        name=masters.cell(row,col).value
        if not name: continue
        course=by_name.get(norm(name))
        if course is None:
            code=f'HEALTH-{row-start+1:03}'
            course={'id':code.lower(),'code':None,'name':text(masters.cell(row,col+1).value,name),'credits':masters.cell(row,col+2).value,'group':'supplementary','categories':[],'pathwayIds':[],'sources':[],**editorial[code]}
            courses.append(course);by_name[norm(name)]=course
        record['courseIds'].append(course['id']); course['pathwayIds'].append(id)
        course['sources'].append({'file':'workbook','sheet':'Master Majors','range':f'{openpyxl.utils.get_column_letter(col)}{row}:{openpyxl.utils.get_column_letter(col+2)}{row}'})
    pathways.append(record)
tools_raw=[]; section=''
for row in range(1,80):
    a,b,c,d=[wb['Specialized Softwares'].cell(row,col).value for col in range(1,5)]
    if isinstance(a,str) and not b: section=a
    if isinstance(a,(int,float)) and b and c:
        ids=[x['id'] for x in courses if norm(x['name']['en'])==norm(b)]
        if b=='Operations Research 1 & 2': ids=['ise-109','ise-110']
        tools_raw.append({'row':row,'section':section,'courseIds':ids,'course':b,'names':c.splitlines(),'urls':d.splitlines() if d else []})
        assert ids, f'Unmatched software course {b}'
for name,obj in [('courses',courses),('pathways',pathways),('software-rows',tools_raw)]: (DATA/f'{name}.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Imported {len(courses)} courses ({sum(c["group"]!="supplementary" for c in courses)} undergraduate), {len(pathways)} pathways, {len(tools_raw)} software rows.')
