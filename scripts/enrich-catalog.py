import json,pathlib,re,urllib.request,urllib.parse,concurrent.futures,datetime
ROOT=pathlib.Path(__file__).resolve().parents[1]; DATA=ROOT/'lib/data'
def read(name): return json.loads((DATA/f'{name}.json').read_text(encoding='utf8'))
def save(name,value): (DATA/f'{name}.json').write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
courses=read('courses'); rows=read('software-rows'); tools={}
for line in (ROOT/'scripts/tool-content.tsv').read_text(encoding='utf8').splitlines():
    name,url,en,fa=line.split('|'); id=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
    tools[name]={'id':id,'name':name,'url':url,'description':{'en':en,'fa':fa},'courseIds':[],'sources':[]}
aliases={
 'AutoCAD (CAD: Computer-Aided Design)':['AutoCAD'], 'FlexSim Warehouse Simulation':['FlexSim'], 'AnyLogic Warehouse Simulation':['AnyLogic'],
 'Odoo Manufacturing (MRP)':['Odoo Manufacturing'], 'Odoo Manufacturing + Inventory':['Odoo Manufacturing','Odoo Inventory'],
 'Python SciPy':['SciPy'], 'NumPy + SciPy':['NumPy','SciPy'], 'jamovi / JASP':['jamovi','JASP'],
 'Microsoft SQL Server / Power Query':['Microsoft SQL Server','Power Query'], 'Python / NumPy Financial Models':['Python','NumPy'],
 'Stata / R':['Stata','R'], 'Power BI':['Microsoft Power BI'], 'Zotero / Mendeley':['Zotero','Mendeley'],
 'Python / R':['Python','R'], 'Siemens Tecnomatix Human-Centered Design / Process Simulate Human':['Siemens Tecnomatix Process Simulate Human']}
for row in rows:
    for raw in row['names']:
        for name in aliases.get(raw,[raw]):
            tool=tools[name]
            tool['courseIds']=sorted(set(tool['courseIds']+row['courseIds']))
            source={'file':'workbook','sheet':'Specialized Softwares','range':f'B{row["row"]}:D{row["row"]}'}
            if source not in tool['sources']: tool['sources'].append(source)
assert all(t['courseIds'] for t in tools.values())
save('tools',list(tools.values()))
# Explicit prerequisite edges transcribed from the PDF course sheets. Recommended standing stays separate.
prereqs={'SCI-102':['SCI-101'],'SCI-115':['SCI-101','SCI-114'],'ISE-102':['ISE-101'],'ISE-104':['ISE-109'],'ISE-105':['ISE-114'],'ISE-106':['ISE-105','ISE-112'],'ISE-107':['ISE-108'],'ISE-108':['SCI-104'],'ISE-109':['SCI-101','ISE-118'],'ISE-110':['ISE-109'],'ISE-111':['ISE-103'],'ISE-113':['ISE-102'],'ISE-114':['ISE-125'],'ISE-115':['ISE-109'],'ISE-116':['ISE-115'],'ISE-117':['SCI-114','ISE-108'],'ISE-118':['SCI-101'],'ISE-119':['SCI-114'],'ISE-120':['SCI-106'],'ISE-121':['ISE-128'],'ISE-122':['ISE-108','ISE-119'],'ISE-124':['GEN-009'],'ISE-126':['ISE-112'],'ISE-131':['ISE-106','ISE-113'],'ISE-132':['ISE-107'],'ISE-134':['ISE-122'],'ISE-135':['ISE-105'],'ISE-136':['SCI-104','ISE-113'],'ISE-137':['ISE-116'],'ISE-138':['ISE-109'],'ISE-139':['ISE-109'],'ISE-140':['SCI-114'],'ISE-142':['ISE-103'],'ISE-143':['ISE-117'],'ISE-144':['ISE-114','ISE-107'],'ISE-145':['ISE-103','ISE-108','SCI-114'],'ISE-146':['ISE-110'],'ISE-148':['SCI-104'],'ISE-149':['SCI-114','ISE-108'],'ISE-150':['ISE-110','ISE-149'],'ISE-151':['ISE-110'],'ISE-152':['ISE-109','ISE-121'],'ISE-153':['SCI-103'],'ISE-154':['ISE-106','ISE-125'],'ISE-155':['SCI-114'],'ISE-156':['ISE-121','ISE-147'],'ISE-157':['ISE-111'],'ISE-158':['ISE-124'],'ISE-159':['ISE-133'],'ISE-161':['ISE-122'],'ISE-162':['ISE-105']}
coreqs={'SCI-103':['SCI-102'],'SCI-104':['SCI-102'],'SCI-116':['SCI-106'],'ISE-125':['ISE-112']}
for c in courses:
    code=c['id'].upper(); c['prerequisiteIds']=[v.lower() for v in prereqs.get(code,[])]; c['corequisiteIds']=[v.lower() for v in coreqs.get(code,[])]
    if code=='SCI-116': c['sources'].append({'file':'curriculum','page':14,'field':'corequisites'})
    c['standing']=None
    minimum={'ISE-103':60,'ISE-111':50,'ISE-124':80,'ISE-129':80,'ISE-133':80,'ISE-141':80,'ISE-147':80,'ISE-127':100,'ISE-151':100}.get(code)
    semester={'ISE-123':5,'ISE-128':6,'ISE-132':7,'ISE-134':6,'ISE-153':6}.get(code)
    if minimum:c['standing']={'en':f'The PDF recommends completing at least {minimum} credits.','fa':f'در PDF گذراندن حداقل {minimum} واحد توصیه شده است.'}
    if semester:c['standing']={'en':f'Semester {semester} or later, as listed in the PDF.','fa':f'مطابق PDF، نیمسال {semester} و پس از آن.'}
def fetch(url):
    request=urllib.request.Request(url,headers={'User-Agent':'ISE-Domain/1.0 (educational catalog; source verification)'})
    with urllib.request.urlopen(request,timeout=25) as response:return json.load(response)
def query(titles,language='en'):
    return fetch(f'https://{language}.wikipedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','titles':'|'.join(titles),'prop':'langlinks|info|pageprops','lllang':'fa','lllimit':'max','inprop':'url','redirects':1}))
topics=list(dict.fromkeys(c['wikiTopic'] for c in courses)); wiki={}; missing=[]
for start in range(0,len(topics),40):
    batch=topics[start:start+40]; result=query(batch); q=result['query']; redirects={x['from']:x['to'] for x in q.get('normalized',[])+q.get('redirects',[])}; found={p['title']:p for p in q['pages'].values()}
    for original in batch:
        title=original; seen=set()
        while title in redirects and title not in seen: seen.add(title);title=redirects[title]
        p=found.get(title)
        if p and 'missing' not in p and 'disambiguation' not in p.get('pageprops',{}):
            wiki[original]={'en':{'title':p['title'],'url':p['fullurl']},'faTitle':next((v['*'] for v in p.get('langlinks',[]) if v['lang']=='fa'),None)}
        else:missing.append(original)
fa_titles=list(dict.fromkeys(w['faTitle'] for w in wiki.values() if w['faTitle'])); fa_found={}
for start in range(0,len(fa_titles),40):
    q=query(fa_titles[start:start+40],'fa')['query']; normalized={v['from']:v['to'] for v in q.get('normalized',[])+q.get('redirects',[])}
    found={p['title']:p for p in q['pages'].values() if 'missing' not in p and 'disambiguation' not in p.get('pageprops',{})}
    for title in fa_titles[start:start+40]:
        dest=title; seen=set()
        while dest in normalized and dest not in seen:seen.add(dest);dest=normalized[dest]
        if dest in found:fa_found[title]={'title':found[dest]['title'],'url':found[dest]['fullurl']}
for c in courses:
    result=wiki.get(c['wikiTopic']); c['wikipedia']={'en':result['en'] if result else None,'fa':fa_found.get(result['faTitle']) if result else None,'relation':'related','verifiedAt':str(datetime.date.today())}
save('courses',courses)
print('Tools:',len(tools),'Wikipedia English:',sum(c['wikipedia']['en'] is not None for c in courses),'Persian:',sum(c['wikipedia']['fa'] is not None for c in courses),'Unresolved:',missing)
