"""Read-only verification of outbound catalog URLs; writes a local audit report."""
import pathlib,json,urllib.request,urllib.error,concurrent.futures,datetime,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
tools=json.loads((ROOT/'lib/data/tools.json').read_text(encoding='utf8'))
resources=re.findall(r"url:\s*'(https://[^']+)'",(ROOT/'lib/resources.ts').read_text(encoding='utf8'))
urls=sorted(set([t['url'] for t in tools]+resources))
def check(url):
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; ISE-Domain educational link check)'})
        with urllib.request.urlopen(req,timeout=18) as res:
            body=res.read(65536).decode('utf8',errors='replace')
            title=re.search(r'<title[^>]*>(.*?)</title>',body,re.S|re.I)
            return {'url':url,'status':res.status,'finalUrl':res.url,'title':re.sub(r'\s+',' ',title[1]).strip()[:180] if title else None}
    except urllib.error.HTTPError as err:return {'url':url,'status':err.code}
    except Exception as err:return {'url':url,'status':None,'error':str(err)[:150]}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(check,urls))
(ROOT/'tmp').mkdir(exist_ok=True)
(ROOT/'tmp/link-audit.json').write_text(json.dumps({'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'results':results},indent=2),encoding='utf8')
print('Checked',len(results),'URLs;',sum(r['status']==200 for r in results),'HTTP 200.')
for r in results:
    if r['status']!=200:print(r['status'],r['url'],r.get('error',''))
