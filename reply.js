#!/usr/bin/env node
// Usage: node reply.js comments.csv [--post post.txt] [--out drafts.csv]
// comments.csv columns: name,comment   (paste or export them yourself; this tool never scrapes LinkedIn)
const fs=require('fs');const args=process.argv.slice(2);const opt=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:null;};
function parseCsv(t){const rows=[];let row=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c==='"'&&t[i+1]==='"'){f+='"';i++;}else if(c==='"')q=false;else f+=c;}
  else if(c==='"')q=true;else if(c===','){row.push(f);f='';}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f='';}else f+=c;}
  if(f||row.length){row.push(f);rows.push(row);}const [h,...b]=rows.filter(r=>r.some(Boolean));return b.map(r=>Object.fromEntries(h.map((k,i)=>[k.trim().toLowerCase(),(r[i]||'').trim()])));}
const csv=v=>'"'+String(v).replace(/"/g,'""')+'"';
async function draft(c,post,style){
  if(!process.env.ANTHROPIC_API_KEY)throw new Error('Set ANTHROPIC_API_KEY');
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},
   body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-sonnet-4-5',max_tokens:300,system:'You draft LinkedIn comment replies for the post author to review. Follow this style guide exactly:\n\n'+style+'\n\nReturn only the reply text, or SKIP.',
   messages:[{role:'user',content:`My post:\n${post||'(not provided)'}\n\nComment from ${c.name}:\n${c.comment}\n\nDraft my reply.`}]})});
  const d=await r.json();if(!r.ok)throw new Error(JSON.stringify(d).slice(0,200));return d.content.map(x=>x.text||'').join('').trim();}
module.exports={parseCsv};
if(require.main===module)(async()=>{
  const file=args[0];if(!file){console.log('Usage: node reply.js comments.csv [--post post.txt] [--out drafts.csv]');process.exit(1);}
  const comments=parseCsv(fs.readFileSync(file,'utf8'));const post=opt('--post')?fs.readFileSync(opt('--post'),'utf8'):'';const style=fs.readFileSync(__dirname+'/style.md','utf8');
  const out=[['name','comment','draft_reply','approved']];
  for(const c of comments){try{const d=await draft(c,post,style);out.push([c.name,c.comment,d,'']);console.log(`\n${c.name}: ${c.comment.slice(0,80)}\n  → ${d}`);}catch(e){console.error(`${c.name}: ${e.message}`);}}
  fs.writeFileSync(opt('--out')||'drafts.csv',out.map(r=>r.map(csv).join(',')).join('\n')+'\n');
  console.log(`\nWrote ${out.length-1} drafts. Read them, edit, mark "approved", then post them yourself.`);})();
