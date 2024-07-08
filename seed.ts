const PROD_LINK = 'https://mostaqem-api.onrender.com/api/v1';
const createLink = `${PROD_LINK}/audio`;
const listLink = 'https://www.mp3quran.net/api/v3/reciters';
// const existReciterLink = `${PROD_LINK}/reciter`;
// const seedMaher = 'https://www.mp3quran.net/api/v3/reciters?reciter=102';

async function createAudio(obj: any) {
  try {
    const _audio = await fetch(createLink, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    await _audio.json();
    // console.log(audio);
    console.log('AUDIO CREATED SUCC');
  } catch (error) {
    console.log('AUDIO CREATED FAIL');

    console.error(error);
  }
}

// (async () => {
//   const list = await fetch(listLink, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const allList = await list.json();
//   const myRecReq = await fetch(existReciterLink, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const myRec = await myRecReq.json();

//   const existNames = myRec['data'].map((my) => my['name_arabic']);

//   console.log(existNames.length);

//   const existList = allList['reciters'].filter((rec) =>
//     existNames.includes(rec.name),
//   );
//   const listObj = [];
//   existList.forEach((element) => {
//     const moshaf = element['moshaf'].filter(
//       (mos) => mos.name == 'حفص عن عاصم - مرتل',
//     );

//     const reciter = myRec['data'].find(
//       (rec) => rec['name_arabic'] === element['name'],
//     );
//     const reciterId = reciter['id'];

//     const audioLink = moshaf[0]['server'];

//     const listOfLinks = moshaf[0]['surah_list'].split(',');

//     for (let i = 1; i <= listOfLinks.length; i++) {
//       const surahFileNumber = i.toString().padStart(3, '0');
//       listObj.push({
//         reciter_id: reciterId,
//         surah_id: i,
//         url: audioLink + `${surahFileNumber}.mp3`,
//       } as never);
//     }
//   });
//   listObj.forEach(async (obj) => {
//     await createAudio(obj);
//   });
// })();

// (async () => {
//   const req = await fetch(seedMaher, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const mahr = await req.json();
//   const listObj = [];
//   const moshaf = mahr['reciters'][0]['moshaf'].filter(
//     (mos) => mos.name == 'حفص عن عاصم - مرتل',
//   );

//   const audioLink = moshaf[0]['server'];

//   const listOfLinks = moshaf[0]['surah_list'].split(',');

//   for (let i = 1; i <= listOfLinks.length; i++) {
//     const surahFileNumber = i.toString().padStart(3, '0');
//     listObj.push({
//       reciter_id: 13,
//       surah_id: i,
//       url: audioLink + `${surahFileNumber}.mp3`,
//     } as never);
//   }
//   listObj.forEach(async (obj) => {
//     await createAudio(obj);
//   });
// })();

// // add missing reciter from another API

// const missingList = [
//   { id: 1, name: 'عبد الباسط عبد الصمد' },
//   { id: 4, name: 'مشاري راشد العفاسي' },
//   { id: 10, name: 'محمود خليل الحصري' },
//   { id: 12, name: 'أبو بكر الشاطرى' },
// ];
// const apiLIink = (resId, surId) =>
//   `https://api.quran.com/api/v4/chapter_recitations/${resId}/${surId}`;

// (async () => {
//   const getReq = await fetch(
//     'https://api.quran.com/api/v4/resources/recitations?language=ar',
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     },
//   );
//   const getRes = await getReq.json();
//   const misNamesList = missingList.map((rec) => rec.name);
//   // console.log(getRes['recitations']);

//   const missedRecList = getRes['recitations'].filter((rec) =>
//     misNamesList.includes(rec['translated_name']['name']),
//   );

//   const uniqueNames = new Set();
//   const filteredObjects = missedRecList.reduce((result, current) => {
//     if (!uniqueNames.has(current['reciter_name'])) {
//       uniqueNames.add(current['reciter_name']);
//       result.push(current);
//     }
//     return result;
//   }, []);
//   filteredObjects.forEach(async (rec) => {
//     for (let surahId = 1; surahId <= 114; surahId++) {
//       const audioReq = await fetch(apiLIink(rec.id, surahId), {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const sysRec = missingList.filter(
//         (mis) => mis.name === rec['translated_name']['name'],
//       );
//       const audioData = await audioReq.json();
//       const audio = audioData['audio_file'];
//       if (audio) {
//         await createAudio({
//           reciter_id: sysRec[0].id,
//           surah_id: surahId,
//           url: audio['audio_url'],
//         });
//       }
//     }
//   });
// })();

(async () => {
  const list = await fetch(listLink, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const allList = await list.json();

  const existList = allList['reciters'].filter((rec) => rec.id == 92);

  const listObj = [];
  existList.forEach((element) => {
    const moshaf = element['moshaf'].filter(
      (mos) => mos.name == 'حفص عن عاصم - مرتل',
    );

    const audioLink = moshaf[0]['server'];

    const listOfLinks = moshaf[0]['surah_list'].split(',');

    for (let i = 1; i <= listOfLinks.length; i++) {
      const surahFileNumber = i.toString().padStart(3, '0');
      listObj.push({
        reciter_id: 15,
        surah_id: i,
        url: audioLink + `${surahFileNumber}.mp3`,
      } as never);
    }
  });
  listObj.forEach(async (obj) => {
    await createAudio(obj);
  });
})();
