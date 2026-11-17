/* This board deliberately has no network or persistent-storage calls. */
(() => {
  const modal = document.querySelector('#mark-dialog');
  if (!modal) return;
  const read = document.querySelector('#read-dialog');
  const form = document.querySelector('#mark-form');
  const canvas = document.querySelector('#drawing');
  const ctx = canvas.getContext('2d');
  const message = document.querySelector('#mark-message');
  const name = document.querySelector('#mark-name');
  const formStatus = document.querySelector('#form-status');
  const board = document.querySelector('#circuit-board');
  const marks = [];
  let drawing = false, hasDrawing = false;
  ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const point = e => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX-r.left)*canvas.width/r.width, (e.clientY-r.top)*canvas.height/r.height];
  };
  canvas.addEventListener('pointerdown', e => {
    drawing = true; hasDrawing = true; canvas.setPointerCapture(e.pointerId);
    const [x,y] = point(e); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+.1,y+.1); ctx.stroke();
  });
  canvas.addEventListener('pointermove', e => { if (drawing) { ctx.lineTo(...point(e)); ctx.stroke(); } });
  for (const event of ['pointerup','pointercancel','lostpointercapture']) canvas.addEventListener(event, () => drawing = false);
  const clearDrawing = () => { ctx.clearRect(0,0,canvas.width,canvas.height); hasDrawing = false; drawing = false; };
  document.querySelector('#clear-drawing').onclick = clearDrawing;
  const openComposer = () => {
    if (marks.length >= 4) return;
    formStatus.textContent = 'Only you can see your marks. They disappear when you reload.';
    modal.showModal(); message.focus();
  };
  document.querySelector('#open-composer').onclick = openComposer;
  document.querySelector('#add-mark').onclick = openComposer;
  document.querySelectorAll('.close-dialog').forEach(b => b.onclick = () => b.closest('dialog').close());
  function showMark(mark) {
    document.querySelector('#read-message').textContent = mark.message;
    document.querySelector('#read-author').textContent = mark.name;
    const image = document.querySelector('#read-drawing');
    image.hidden = !mark.image;
    if (mark.image) image.src = mark.image; else image.removeAttribute('src');
    read.showModal();
  }
  document.querySelectorAll('[data-note]').forEach(b => b.onclick = () => showMark({message:b.dataset.note,name:b.dataset.author+' · Sample mark'}));
  form.onsubmit = e => {
    e.preventDefault();
    const text = message.value.trim();
    if (!text && !hasDrawing) { formStatus.textContent = 'Add a thought or a doodle first.'; message.focus(); return; }
    if (marks.length >= 4) return;
    const mark = {message:text,name:name.value.trim() || 'Anonymous',image:hasDrawing ? canvas.toDataURL() : ''};
    const slot = marks.length;
    const sample = board.querySelectorAll('[data-note]')[0];
    if (sample) sample.remove();
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'board-mark visitor-mark visitor-slot-'+slot;
    b.setAttribute('aria-label','Read mark by '+mark.name);
    const pin = document.createElement('span'); pin.className='mark-pin'; b.append(pin);
    if (mark.image) {const image=document.createElement('img');image.src=mark.image;image.alt='Your doodle';b.append(image);}
    if (text) {const t=document.createElement('span');t.className='handwritten';t.textContent=text.length>45?text.slice(0,45)+'…':text;b.append(t);}
    const author=document.createElement('small');author.textContent=mark.name;b.append(author);
    b.onclick=()=>showMark(mark);board.append(b);marks.push(mark);
    const samples=board.querySelectorAll('[data-note]').length;
    document.querySelector('#board-count').textContent=marks.length+' of your marks'+(samples?' · '+samples+' samples':'');
    document.querySelector('#preview-status').textContent=marks.length===4?'Your board is full for this visit. Reload to start again.':'Only you can see these marks. They reset when you reload.';
    if(marks.length===4){document.querySelector('#open-composer').hidden=true;document.querySelector('#add-mark').disabled=true;}
    form.reset();clearDrawing();modal.close();b.focus();
  };
})();
