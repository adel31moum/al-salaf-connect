
(function(){
  'use strict';

  // ===== AMBIENT SOUND (Web Audio API — generates real wind/night sound) =====
  var audioCtx = null;
  var ambientNodes = null;
  var soundOn = true;

  function initAudio() {
    if(audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { return; }
  }

  function startAmbient(type) {
    if(!soundOn) return;
    initAudio();
    if(!audioCtx) return;
    stopAmbient();

    // Wind noise
    var bufferSize = 4 * audioCtx.sampleRate;
    var noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = noiseBuffer.getChannelData(0);
    for(var i=0; i<bufferSize; i++) {
      data[i] = (Math.random()*2-1) * 0.3;
    }
    var noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'night' ? 150 : type === 'tent' ? 300 : 250;
    filter.Q.value = 0.5;

    var gain = audioCtx.createGain();
    gain.gain.value = type === 'night' ? 0.04 : type === 'tent' ? 0.03 : 0.05;

    // LFO for natural wind variation
    var lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.1;
    var lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
    lfo.start();

    ambientNodes = { noise: noise, lfo: lfo, gain: gain };
  }

  function stopAmbient() {
    if(ambientNodes) {
      try { ambientNodes.noise.stop(); ambientNodes.lfo.stop(); } catch(e) {}
      ambientNodes = null;
    }
  }

  // ===== QURAN AUDIO (EveryAyah — Mishary Alafasy) =====
  var quranBase = 'https://everyayah.com/data/Alafasy_128kbps/';
  var currentAudio = null;

  function playAyah(surah, ayah) {
    if(!soundOn) return;
    initAudio();
    stopAyah();
    var url = quranBase + String(surah).padStart(3,'0') + String(ayah).padStart(3,'0') + '.mp3';
    currentAudio = new Audio(url);
    currentAudio.play().catch(function(){});
  }
  function stopAyah() { if(currentAudio) { currentAudio.pause(); currentAudio = null; } }

  window.toggleSound = function() {
    soundOn = !soundOn;
    document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
    if(!soundOn) { stopAyah(); stopAmbient(); }
    else { startAmbient(currentAmbientType); }
  };

  // ===== BACKGROUND SCENES =====
  var allBgs = ['bg_video_night','bg_video_dunes','bg_sheikh_tent','bg_groom_sheikh','bg_men_outside','bg_contract','bg_tent_night'];
  var currentBg = -1;
  var currentAmbientType = 'night';

  function showBg(id, ambientType) {
    allBgs.forEach(function(b){
      var el = document.getElementById(b);
      if(b === id) { el.classList.add('active'); var v = el.querySelector('video'); if(v) v.play().catch(function(){}); }
      else el.classList.remove('active');
    });
    currentBg = id;
    // Restart Ken Burns animation
    var el = document.getElementById(id);
    if(el && !el.classList.contains('video-bg')) {
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = '';
    }
    // Switch ambient sound
    if(ambientType && ambientType !== currentAmbientType) {
      currentAmbientType = ambientType;
      startAmbient(ambientType);
    }
  }

  // ===== TYPING =====
  function type(el, text, speed, cb) {
    el.innerHTML = ''; var i = 0, c = document.createElement('span'); c.className = 'cursor'; el.appendChild(c);
    function t() { if(i < text.length) { c.insertAdjacentText('beforebegin', text[i++]); setTimeout(t, speed); } else { c.remove(); if(cb) cb(); } }
    t();
  }
  function narrate(lines, cb) {
    var el = document.getElementById('narrText');
    var idx = 0;
    function nxt() {
      if(idx >= lines.length) { if(cb) cb(); return; }
      type(el, lines[idx], 32, function(){ idx++; setTimeout(nxt, 450); });
    }
    nxt();
  }
  function showVerse(text, ref) {
    document.getElementById('verseBox').innerHTML = text + '<div class="ref">' + ref + '</div>';
    document.getElementById('verseDisp').classList.add('show');
  }
  function hideVerse() { document.getElementById('verseDisp').classList.remove('show'); }

  // ===== PROGRESS =====
  var sceneNames = ['الصحراء','الشيخ في الخيمة','العريس يدخل','النفر خارج الخيمة','العقد','الفرح','الشيخ يكلمك','التسجيل','التوجيه'];
  var currentScene = 0, totalScenes = 9;
  function updateProgress() {
    var p = document.getElementById('progress');
    p.innerHTML = '';
    for(var i=0; i<totalScenes; i++) {
      var d = document.createElement('div'); d.className = 'pdot';
      if(i < currentScene) d.classList.add('done');
      if(i === currentScene) d.classList.add('on');
      p.appendChild(d);
    }
    document.getElementById('sceneLabel').textContent = sceneNames[currentScene];
  }

  // ===== THE FILM =====
  window.startFilm = function() {
    document.getElementById('startScreen').classList.add('hide');
    setTimeout(function(){ startAmbient('night'); scene1(); }, 1000);
  };

  // Scene 1: Desert night — opening
  function scene1() {
    currentScene = 0; updateProgress();
    showBg('bg_video_night', 'night');
    document.getElementById('narrIcon').textContent = '🏜️';
    setTimeout(function(){
      narrate([
        'في صحراءِ الزمان، تحت سماءٍ مرصعةٍ بالنجوم...',
        'اقتربَ للناسِ حسابُهم وهم في غفلةٍ معرضون',
      ], function(){
        playAyah(21, 1);
        showVerse('اقْتَرَبَ لِلنَّاسِ حِسَابُهُمْ وَهُمْ فِي غَفْلَةٍ مُعْرِضُونَ', '﴿الأنبياء: ١﴾');
        setTimeout(function(){
          narrate([
            'في هذه الأزمانِ صار الزواجُ عسيراً والفتنُ كثيرة',
            'لكنّ السلفَ الصالحَ كانوا يبتغون النكاحَ للعفاف',
          ], function(){
            playAyah(24, 32);
            showVerse('وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ', '﴿النور: ٣٢﴾');
            setTimeout(scene2, 3500);
          });
        }, 2000);
      });
    }, 1500);
  }

  // Scene 2: Sheikh in the tent — LONG THICK BEARD emphasis
  function scene2() {
    currentScene = 1; updateProgress();
    showBg('bg_sheikh_tent', 'tent');
    document.getElementById('narrIcon').textContent = '🕌';
    hideVerse();
    setTimeout(function(){
      narrate([
        'في خيمةٍ نُصبتْ في الصحراء، الشيخُ حازمٌ يجلس',
        'بلحيةٍ طويلةٍ جداً كثيفةٍ غيرِ مخفّفة، وشاربٍ ممذون',
        'كما كان السلفُ الصالحُ على هديِ النبي ﷺ',
        'أمامهُ القرآنُ مفتوحٌ على منبرٍ خشبي',
        'ينتظرُ العروسَ ليُمضيَ العقدَ الشرعي',
      ], function(){
        setTimeout(scene3, 2500);
      });
    }, 1800);
  }

  // Scene 3: The groom enters — ALSO LONG THICK BEARD
  function scene3() {
    currentScene = 2; updateProgress();
    showBg('bg_groom_sheikh', 'tent');
    document.getElementById('narrIcon').textContent = '🤝';
    setTimeout(function(){
      narrate([
        'يدخلُ العريسُ الشابُّ السلفي',
        'بلحيةٍ طويلةٍ كثيفةٍ كأخيها من السنة، وشاربٍ ممذون',
        'بثوبٍ نظيف، يجلسُ بجانبَ الشيخ',
        'يضعُ يدَهُ اليمنى على المصحف، وينتظرُ كلماتِ العقد',
      ], function(){
        playAyah(24, 30);
        showVerse('قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ', '﴿النور: ٣٠﴾');
        setTimeout(scene4, 3500);
      });
    }, 1800);
  }

  // Scene 4: The men stay outside — sitting, talking, joking
  function scene4() {
    currentScene = 3; updateProgress();
    showBg('bg_men_outside', 'night');
    document.getElementById('narrIcon').textContent = '👥';
    hideVerse();
    setTimeout(function(){
      narrate([
        'النفرُ من الرجالِ يبقونَ في الخارج',
        'يجلسونَ على الأرض، يتحدثونَ ويتمازحون',
        'لا دخولَ إلا الوليُّ والشهود',
        'لا اختلاطَ، لا منكرَ، فقط وقارٌ وعقد',
      ], function(){
        setTimeout(scene5, 3000);
      });
    }, 1800);
  }

  // Scene 5: The contract — hands on Quran + DUA
  function scene5() {
    currentScene = 4; updateProgress();
    showBg('bg_contract', 'tent');
    document.getElementById('narrIcon').textContent = '✍️';
    setTimeout(function(){
      narrate([
        'الشيخُ يقرأ الإيجاب:',
        'زوّجتكَ على سنةِ اللهِ ورسوله',
        'العريسُ يقولُ القبول:',
        'قبلتُ النكاحَ على سنةِ اللهِ ورسوله',
        'بوليٍّ مرضيٍّ، ومهرٍ معلومٍ، وشهودٍ عدول',
        'ثمّ يدعو الشيخُ بالبركة: بارك اللهُ لكما وبارك عليكما',
        'والعقدُ مُتَمُّ، والحمدُ لله',
      ], function(){
        playAyah(4, 1);
        showVerse('يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ', '﴿النساء: ١﴾');
        setTimeout(scene6, 4500);
      });
    }, 1800);
  }

  // Scene 6: Celebration — MEN sit and joke, WOMEN celebrate with duff inside
  function scene6() {
    currentScene = 5; updateProgress();
    showBg('bg_tent_night', 'night');
    document.getElementById('narrIcon').textContent = '🌹';
    hideVerse();
    setTimeout(function(){
      narrate([
        'تم العقدُ — والحمدُ لله',
        'الرجالُ في الخارجِ يجلسون، يتحدثون ويتمازحون',
        'لا دفّ مع الرجال، بل وقارٌ وسكينة',
        'أما النساءُ في الداخل، ف يحتفلنَ بالدفّ مع الصبيان',
        'كلٌّ في مكانِه، لا اختلاطَ بين الرجالِ والنساء',
        'والشيخُ يخرجُ، يمشي ببطء، بصوتٍ عذبٍ يرقي:',
        'استوصوا بالنساءِ خيراً',
        'خيرُكم خيرُكم لأهلِه',
        'لا ضررَ ولا ضرار',
      ], function(){
        playAyah(30, 21);
        showVerse('وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا', '﴿الروم: ٢١﴾');
        setTimeout(scene7, 4500);
      });
    }, 1800);
  }

  // Scene 7: Sheikh turns to the user
  function scene7() {
    currentScene = 6; updateProgress();
    showBg('bg_sheikh_tent', 'tent');
    document.getElementById('narrIcon').textContent = '🤲';
    hideVerse();
    setTimeout(function(){
      narrate([
        'يلتفتُ إليكَ الشيخُ حازمٌ،',
        'ينظرُ في عينيك،',
        'ويقولُ بصوتٍ دافئ:',
        'أتريدُ أن تتزوّج؟',
      ], function(){
        window.showInteraction();
      });
    }, 1500);
  }

  // ===== ALL INTERACTION FUNCTIONS ON window =====
  window.showInteraction = function() {
    var el = document.getElementById('interact');
    el.innerHTML = '<div class="i-card"><div class="i-title">🤲 أتريدُ أن تتزوّج؟</div><input class="i-input" type="text" id="userAns" placeholder="اكتب إجابتك..." onkeypress="if(event.key===\'Enter\')handleAns()"><button class="btn" onclick="handleAns()">إرسال ✓</button></div>';
    el.classList.add('show');
  };

  window.handleAns = function() {
    var ans = document.getElementById('userAns');
    if(!ans || !ans.value.trim()) { alert('اكتب إجابتك'); return; }
    document.getElementById('interact').classList.remove('show');
    document.getElementById('narrIcon').textContent = '📖';
    narrate([
      'أحسنت. تعالَ إلى المائدة',
      'أفتحُ الكتابَ وأبدأُ البحثَ عن الموافقِ الشرعي',
      'لكن قبل ذلك — تعهّدْ بالصدقِ والجدية',
    ], function(){
      showVerse('«من استطاعَ منكم الباءةَ فليتزوّج»', '﴿متفق عليه﴾');
      setTimeout(function(){ window.showPledge(); }, 2500);
    });
  };

  window.showPledge = function() {
    var el = document.getElementById('interact');
    el.innerHTML = '<div class="i-card"><div class="i-title">تعهد الجدية والمصداقية</div>'+
      '<div style="display:flex;flex-direction:column;gap:8px">'+
      '<div style="display:flex;gap:8px;align-items:flex-start;font-size:0.8rem;color:#c4a880"><div class="pcheck" onclick="this.classList.toggle(\'on\')"></div><span>أُقرّ بأن جميع البيانات صحيحة وكاملة</span></div>'+
      '<div style="display:flex;gap:8px;align-items:flex-start;font-size:0.8rem;color:#c4a880"><div class="pcheck" onclick="this.classList.toggle(\'on\')"></div><span>إدخال بيانات كاذبة يُجمّد حسابي فوراً</span></div>'+
      '<div style="display:flex;gap:8px;align-items:flex-start;font-size:0.8rem;color:#c4a880"><div class="pcheck" onclick="this.classList.toggle(\'on\')"></div><span>ألتزم بآداب الإسلام وأقبل الإشراف الشرعي</span></div>'+
      '<div style="display:flex;gap:8px;align-items:flex-start;font-size:0.8rem;color:#c4a880"><div class="pcheck" onclick="this.classList.toggle(\'on\')"></div><span>أقبل الولاية الشرعية</span></div>'+
      '</div>'+
      '<div style="font-size:0.72rem;color:#c0522e;text-align:center;padding:8px;margin-top:8px;background:rgba(192,82,46,0.08);border-radius:8px">قال ﷺ: «من غشّنا فليس منّا» ﴿رواه مسلم﴾</div>'+
      '<button class="btn" style="margin-top:10px" onclick="showReg()">أتعهد وأكمل ←</button>'+
      '</div>';
    el.classList.add('show');
  };

  window.showReg = function() {
    var el = document.getElementById('interact');
    el.innerHTML = '<div class="i-card"><div class="i-title">التسجيل الشرعي</div><div class="reg-scroll">'+
      '<div class="rf"><label class="rl">الاسم (سري)</label><input class="ri" type="text" id="f_name"></div>'+
      '<div class="rr"><div class="rf"><label class="rl">الجنس</label><select class="rs" id="f_gender"><option value="">اختر</option><option value="male">ذكر</option><option value="female">أنثى</option></select></div><div class="rf"><label class="rl">العمر</label><input class="ri" type="number" id="f_age"></div></div>'+
      '<div class="rf"><label class="rl">الحالة</label><select class="rs" id="f_status"><option value="">اختر</option><option value="single">أعزب</option><option value="divorced">مطلق</option><option value="widowed">أرمل</option></select></div>'+
      '<div class="rr"><div class="rf"><label class="rl">الأولاد</label><input class="ri" type="number" id="f_children" value="0"></div><div class="rf"><label class="rl">المدينة</label><input class="ri" type="text" id="f_city"></div></div>'+
      '<div class="rf"><label class="rl">الالتزام</label><select class="rs" id="f_deen"><option value="">اختر</option><option value="very">ملتزم جداً (سلفي)</option><option value="practicing">ملتزم</option><option value="learning">في طريق الالتزام</option><option value="new">مسلم جديد</option></select></div>'+
      '<div class="rr"><div class="rf"><label class="rl">المؤهل</label><input class="ri" type="text" id="f_edu"></div><div class="rf"><label class="rl">المهنة</label><input class="ri" type="text" id="f_job"></div></div>'+
      '<div class="rf" id="waliF" style="display:none"><label class="rl">الولي (للنساء)</label><input class="ri" type="text" id="f_wali"></div>'+
      '<div class="rf"><label class="rl">نبذة عني</label><textarea class="rt" id="f_bio"></textarea></div>'+
      '<div class="rf"><label class="rl">أبحث عن</label><textarea class="rt" id="f_seeking"></textarea></div>'+
      '<button class="btn" onclick="doReg()">حفظ والبحث عن الموافق ✓</button>'+
      '</div></div>';
    el.classList.add('show');
    document.getElementById('f_gender').onchange = function(){ document.getElementById('waliF').style.display = this.value === 'female' ? 'flex' : 'none'; };
  };

  window.doReg = function() {
    var n = document.getElementById('f_name'), a = document.getElementById('f_age'), g = document.getElementById('f_gender');
    if(!n.value.trim()||!a.value||!g.value) { alert('املأ الاسم والعمر والجنس'); return; }
    document.getElementById('interact').classList.remove('show');
    scene8();
  };

  // Scene 8: Sheikh checks the book
  function scene8() {
    currentScene = 7; updateProgress();
    showBg('bg_groom_sheikh', 'tent');
    document.getElementById('narrIcon').textContent = '📖';
    hideVerse();
    setTimeout(function(){
      narrate([
        'الشيخُ يفتحُ الكتابَ ويقلّبُ الصفحات',
        'يتفحّصُ معلوماتِك...',
        'يبحثُ عن الموافقِ الشرعي...',
      ], function(){
        playAyah(24, 33);
        showVerse('وَلْيَسْتَعْفِفِ الَّذِينَ لَا يَجِدُونَ نِكَاحًا حَتَّىٰ يُغْنِيَهُمُ اللَّهُ', '﴿النور: ٣٣﴾');
        setTimeout(function(){
          var el = document.getElementById('interact');
          el.innerHTML = '<div class="i-card" style="text-align:center"><div style="font-size:1.4rem;margin-bottom:8px">📋</div><div class="i-title">الشيخ يتفحّص معلوماتك</div><p style="font-size:0.8rem;color:#c4a880;line-height:1.7;margin-bottom:10px">تم تسجيل ملفك الشرعي بنجاح<br>إن وُجد الموافق، سيُوجّهك الشيخ مباشرة</p><div style="font-family:Amiri;font-size:0.82rem;color:#d4af64;line-height:1.8">«لا نكاحَ إلا بوليٍّ»<br><span style="font-size:0.64rem;color:#8a7050">﴿أبو داود والترمذي﴾</span></div><button class="btn" style="margin-top:12px" onclick="scene9()">التوجيه الآلي ←</button></div>';
          el.classList.add('show');
        }, 2000);
      });
    }, 1500);
  };

  // Scene 9: Guidance & Success
  window.scene9 = function() {
    currentScene = 8; updateProgress();
    showBg('bg_tent_night', 'night');
    document.getElementById('interact').classList.remove('show');
    document.getElementById('narrIcon').textContent = '🌟';
    hideVerse();
    setTimeout(function(){
      narrate([
        'رحلةُ الميثاقِ اكتملت',
        'نسأل اللهَ أن يرزقكَ الزوجَ أو الزوجةَ الصالحة',
        'ثلاثةٌ حقٌّ على اللهِ عونُهنّ — ومنها الناكحُ يريدُ العفاف',
      ], function(){
        playAyah(30, 21);
        showVerse('وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً', '﴿الروم: ٢١﴾');
        setTimeout(function(){
          var el = document.getElementById('interact');
          el.innerHTML = '<div class="i-card"><div class="i-title">التوجيه الآلي — الحقوق والواجبات</div><div class="reg-scroll">'+
            '<div class="guide-c"><h4>🕌 حقوق الزوج</h4><p>النفقةُ والسكنى والكسوةُ واجبة. «اتقوا اللهَ في النساءِ» ﴿مسلم﴾</p></div>'+
            '<div class="guide-c"><h4>🌸 حقوق الزوجة</h4><p>الطاعةُ في المعروف. «فَالصَّالِحَاتُ قَانِتَاتٌ» ﴿النساء: ٣٤﴾</p></div>'+
            '<div class="guide-c"><h4>🤝 آداب المعاشرة</h4><p>«وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ» ﴿النساء: ١٩﴾</p></div>'+
            '<div class="guide-c"><h4>💰 المهر</h4><p>يُيسَّر للمعسرين. القصدُ لا الإسراف.</p></div>'+
            '<div class="guide-c"><h4>🏠 الولاية</h4><p>«لا نكاحَ إلا بوليٍّ» ﴿أبو داود والترمذي﴾</p></div>'+
            '<div class="experts"><span class="expert">🧠 نفس</span><span class="expert">📜 شرع</span><span class="expert">⚖️ قانون</span><span class="expert">📖 لغة</span><span class="expert">👁️ تجربة</span><span class="expert">🏗️ هندسة</span><span class="expert">📊 مقارنة</span></div>'+
            '<button class="btn" style="margin-top:10px" onclick="restart()">إعادة المشهد 🪔</button>'+
            '</div></div>';
          el.classList.add('show');
        }, 2000);
      });
    }, 1500);
  };

  window.restart = function() {
    document.getElementById('interact').classList.remove('show');
    stopAyah(); hideVerse(); scene1();
  };

  // ===== AI SUPPORT =====
  var reports = 0;
  window.aiToggle = function() {
    var p = document.getElementById('aiPanel');
    p.classList.toggle('show');
    if(p.classList.contains('show')) document.getElementById('aiBdg').style.display = 'none';
  };

  var R = [
    {k:['خطأ','عطل','مشكلة','لا يعمل'],r:'تم تسجيل العطل. سأرسل تقريراً آلياً لفريق التقنية.',a:1},
    {k:['شكوى','بلاغ'],r:'تم استلام بلاغك. سيُراجع خلال 24 ساعة.',a:1},
    {k:['مساعدة','help','كيف'],r:'أستطيع مساعدتك في: المشهد، التسجيل، الولاية الشرعية، أو أي مشكلة.'},
    {k:['تسجيل','register'],r:'للتسجيل: انتظر حتى يسألك الشيخ "أتريد أن تتزوّج؟" ثم اكتب إجابتك.'},
    {k:['صوت','مسموع','لا أسمع'],r:'للسيطرة على الصوت: اضغط 🔊 في الأعلى. النظام يستخدم تلاوةً حقيقيةً بصوت المشاري العفاسي.'},
    {k:['مشهد','صورة','خيمة','لحية'],r:'المشهد يستخدم صوراً حقيقية مع تأثير حركي (Ken Burns). اللحية طويلة كثيفة كما على هدي السلف.'},
    {k:['احتفال','فرح','دف'],r:'الرجال يجلسون ويتمازحون بلا دفّ. النساء يحتفلن بالدفّ مع الصبيان في الداخل — لا اختلاط.'},
    {k:['ولي','ولاية'],r:'بدون وليٍّ، تتولّى المنصة جهة الولاية الشرعية المختصة.'},
    {k:['شكرا','thank'],r:'العفو 🤝 يسعدني مساعدتك.'},
  ];

  window.aiSend = function() {
    var inp = document.getElementById('aiInput');
    var txt = inp.value.trim(); if(!txt) return;
    var msgs = document.getElementById('aiMsgs');
    var u = document.createElement('div'); u.className = 'am user'; u.textContent = txt; msgs.appendChild(u);
    inp.value = ''; msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function(){
      var matched = false;
      for(var i=0;i<R.length;i++) {
        for(var j=0;j<R[i].k.length;j++) {
          if(txt.indexOf(R[i].k[j]) >= 0) {
            matched = true;
            var ai = document.createElement('div'); ai.className = 'am ai'; ai.textContent = R[i].r; msgs.appendChild(ai);
            msgs.scrollTop = msgs.scrollHeight;
            if(R[i].a) { setTimeout(function(){ reports++; var s = document.createElement('div'); s.className = 'am sys'; s.textContent = '✓ تقرير #' + reports + ' — ' + new Date().toLocaleDateString('ar-DZ'); msgs.appendChild(s); msgs.scrollTop = msgs.scrollHeight; }, 800); }
            return;
          }
        }
      }
      if(!matched) {
        reports++;
        var ai = document.createElement('div'); ai.className = 'am ai'; ai.textContent = 'تم استلام رسالتك. سأحللها وأرسلها للفريق.'; msgs.appendChild(ai);
        msgs.scrollTop = msgs.scrollHeight;
        setTimeout(function(){ var s = document.createElement('div'); s.className = 'am sys'; s.textContent = '✓ بلاغ #' + reports + ' — ' + new Date().toLocaleDateString('ar-DZ'); msgs.appendChild(s); msgs.scrollTop = msgs.scrollHeight; }, 1000);
      }
    }, 700);
  };

  // INIT
  updateProgress();
  showBg('bg_video_night', 'night');

})();

