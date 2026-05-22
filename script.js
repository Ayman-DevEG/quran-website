const reciterInput = document.getElementById('reciterInput');
const recitersDataList = document.getElementById('recitersDataList');
const surahSelect = document.getElementById('surahSelect');
const playerContainer = document.getElementById('playerContainer');
const playingTitle = document.getElementById('playingTitle');
const audioPlayer = document.getElementById('audioPlayer');
const downloadBtn = document.getElementById('downloadBtn');

const API_BASE = "https://mp3quran.net/api/v3";
let recitersList = [];


const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", 
    "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", 
    "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", 
    "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", 
    "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", 
    "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", 
    "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", 
    "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", 
    "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", 
    "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", 
    "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];


async function fetchReciters() {
    try {
        const response = await fetch(`${API_BASE}/reciters?language=ar`);
        const data = await response.json();
        recitersList = data.reciters;
        

        recitersList.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        
        recitersDataList.innerHTML = '';
        
        recitersList.forEach(reciter => {
            const option = document.createElement('option');
            option.value = reciter.name; 
            recitersDataList.appendChild(option);
        });
        
        reciterInput.placeholder = "اكتب اسم الشيخ هنا...";
    } catch (error) {
        console.error("حدث خطأ أثناء جلب القراء:", error);
        reciterInput.placeholder = "خطأ في تحميل البيانات..";
    }
}


reciterInput.addEventListener('input', (e) => {
    const selectedName = e.target.value;
    const selectedReciter = recitersList.find(r => r.name === selectedName);
    
    surahSelect.innerHTML = '<option value="">-- اختر السورة --</option>';
    surahSelect.disabled = true;
    playerContainer.classList.add('hidden');
    audioPlayer.pause();

    if (selectedReciter) {
        const moshaf = selectedReciter.moshaf[0]; 
        const surahList = moshaf.surah_list.split(',');

        surahSelect.disabled = false;
        

        surahList.forEach(surahNumber => {
            const surahIndex = parseInt(surahNumber) - 1;
            const nameOfSurah = surahNames[surahIndex] || `سورة ${surahNumber}`;
            const audioUrl = `${moshaf.server}${surahNumber.padStart(3, '0')}.mp3`;
            
            const option = document.createElement('option');
            option.value = audioUrl;
            option.textContent = nameOfSurah;
            surahSelect.appendChild(option);
        });
    }
});


surahSelect.addEventListener('change', (e) => {
    const audioUrl = e.target.value;
    
    if (!audioUrl) {
        playerContainer.classList.add('hidden');
        return;
    }

    const reciterName = reciterInput.value;
    const surahName = surahSelect.options[surahSelect.selectedIndex].text;

    playingTitle.textContent = `سورة ${surahName} - بصوت الشيخ ${reciterName}`;
    audioPlayer.src = audioUrl;
    downloadBtn.href = audioUrl;

    playerContainer.classList.remove('hidden');
    audioPlayer.play();
});

fetchReciters();