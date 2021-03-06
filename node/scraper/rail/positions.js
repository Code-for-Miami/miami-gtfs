const parseString = require('xml2js').parseString;

export default async function getRailPositions(
  url = 'http://www.miamidade.gov/transit/WebServices/Trains/'
) {
  const text = await fetch(url).then(res => res.text());
  const xml = await new Promise(resolve => {
    parseString(text, (err, result) => {
      resolve(result.RecordSet.Record);
    });
  });

  return xml.reduce(
    (acc, record) => ({
      ...acc,
      [record.TrainID[0]]: {
        kind: 'rail',
        id: record.TrainID[0],
        lat: parseFloat(record.Latitude[0], 10),
        lng: parseFloat(record.Longitude[0], 10),
        route: record.LineID[0],
        direction: record.ServiceDirection[0],
        pointing: record.Direction[0],
        arrivals: []
      }
    }),
    {}
  );
}
