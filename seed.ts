const createLink = 'http://localhost:3000/api/v1/audio';
const listLink = 'https://www.mp3quran.net/api/v3/reciters';
const existReciterLink = 'http://localhost:3000/api/v1/reciter';
const seedMaher = 'https://www.mp3quran.net/api/v3/reciters?reciter=102';
async function createAudio(obj: any) {
  try {
    const _audio = await fetch(createLink, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    const audio = await _audio.json();
    // console.log(audio);
    console.log('AUDIO CREATED SUCC');
  } catch (error) {
    console.log('AUDIO CREATED FAIL');

    console.error(error);
  }
}

(async () => {
  const list = await fetch(listLink, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const allList = await list.json();
  const myRecReq = await fetch(existReciterLink, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const myRec = await myRecReq.json();
  const existNames = myRec['data'].map((my) => my['name_arabic']);
  console.log(existNames.length);
  const existList = allList['reciters'].filter((rec) =>
    existNames.includes(rec.name),
  );
  const listObj = [];
  existList.forEach((element) => {
    const moshaf = element['moshaf'].filter(
      (mos) => mos.name == 'حفص عن عاصم - مرتل',
    );

    const reciter = myRec['data'].find(
      (rec) => rec['name_arabic'] === element['name'],
    );
    const reciterId = reciter['id'];

    const audioLink = moshaf[0]['server'];

    const listOfLinks = moshaf[0]['surah_list'].split(',');

    for (let i = 1; i <= listOfLinks.length; i++) {
      if (i < 100 && i < 10) {
        listObj.push({
          reciter_id: reciterId,
          surah_id: i,
          url: audioLink + `00${i}.mp3`,
        });
      } else if (i < 100 && i > 10) {
        listObj.push({
          reciter_id: reciterId,
          surah_id: i,
          url: audioLink + `0${i}.mp3`,
        });
      } else {
        listObj.push({
          reciter_id: reciterId,
          surah_id: i,
          url: audioLink + `${i}.mp3`,
        });
      }
    }
  });
  listObj.forEach(async (obj) => {
    await createAudio(obj);
  });
})();

(async () => {
  const req = await fetch(seedMaher, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const mahr = await req.json();
  const listObj = [];
  const moshaf = mahr['reciters'][0]['moshaf'].filter(
    (mos) => mos.name == 'حفص عن عاصم - مرتل',
  );

  const audioLink = moshaf[0]['server'];

  const listOfLinks = moshaf[0]['surah_list'].split(',');

  for (let i = 1; i <= listOfLinks.length; i++) {
    if (i < 100 && i < 10) {
      listObj.push({
        reciter_id: 13,
        surah_id: i,
        url: audioLink + `00${i}.mp3`,
      });
    } else if (i < 100 && i > 10) {
      listObj.push({
        reciter_id: 13,
        surah_id: i,
        url: audioLink + `0${i}.mp3`,
      });
    } else {
      listObj.push({
        reciter_id: 13,
        surah_id: i,
        url: audioLink + `${i}.mp3`,
      });
    }
  }
  listObj.forEach(async (obj) => {
    await createAudio(obj);
  });
})();

// add missing reciter from another API

// const missingList = [
//   { id: 1, name: 'عبد الباسط عبد الصمد' },
//   { id: 4, name: 'مشاري راشد العفاسي' },
//   { id: 10, name: 'محمود خليل الحصري' },
//   { id: 12, name: 'أبو بكر الشاطرى' },
// ];
// const apiLIink = (resId, surId) =>
//   `https://api.quran.com/api/v4/chapter_recitations/${resId}/${surId}`;
// (async () => {
//   missingList.forEach(async (reciterId) => {
//     for (let surahId = 1; surahId <= 114; surahId++) {
//       const req = await fetch(apiLIink(reciterId, surahId), {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const res = await req.json();
//       const audio = res['audio_file'];
//       if (audio) {
//         await createAudio({
//           reciter_id: reciterId,
//           surah_id: surahId,
//           url: audio['audio_url'],
//         });
//       }
//       console.log(`SEED SUCCESSFULlY REC : ${reciterId} , SUR : ${surahId}`);
//     }
//   });
// })();

// (async () => {
//   //check seed in mess
//   missingList.forEach(async (reciterId) => {
//     for (let surahId = 1; surahId <= 114; surahId++) {
//       let count = 0;
//       const req = await fetch(
//         `http://localhost:3000/api/v1/audio?surah_id=${surahId}&reciter_id=${reciterId}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       const res = await req.json();

//       if (res.status) {
//         count++;
//       } else {
//         const req = await fetch(apiLIink(reciterId, surahId), {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const res = await req.json();
//         const audio = res['audio_file'];
//         if (audio) {
//           await createAudio({
//             reciter_id: reciterId,
//             surah_id: surahId,
//             url: audio['audio_url'],
//           });
//         }
//         console.log(`SEED SUCCESSFULlY REC : ${reciterId} , SUR : ${surahId}`);
//       }
//     }
//   });
// })();
