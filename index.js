const { google } = require('googleapis')
const privateKey = require('./private-key.json')

const jwtClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ['https://www.googleapis.com/auth/drive']
)

async function ls() {
  let resp = await jwtClient.authorize()
  // console.log(resp)
  // console.log('\n\n\n===============================\n\n\n')

  const drive = google.drive({
    version: 'v3',
    auth: jwtClient
  })
  resp = await drive.files.list({
    fileId: '1gT6FU1Zycec7MW-s6Z6fCkrBdtzIJTsj',
    q: 'mimeType="audio/mp3"',
    orderBy: 'name desc'
  })

  // console.log(resp.data.files)

  const downloadLink = 'https://drive.google.com/uc?export=download&id='

  let podItems = ''
  let month = 1
  for(let podItem of resp.data.files) {
    let link = downloadLink + podItem.id
    const title = podItem.name.substring(5).slice(0, podItem.name.length - 9)
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - month)
    podItems += `<item>
    <title>${title}</title>
    <link>
        ${link}
    </link>
    <pubDate>${date.toISOString()}</pubDate>
    <description>
      ${title}
    </description>
    <enclosure url="${link}" type="audio/mpeg"/>
    <guid>
        ${link}
    </guid>
    <itunes:summary>
      ${title}
    </itunes:summary>
  </item>\n`

    month++
  }

  const podFeed = `<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:rawvoice="http://www.rawvoice.com/rawvoiceRssModule/" version="2.0">
  <channel>
      <title>Hardcore History</title>
      <link>https://www.dancarlin.com/hardcore-history-series/</link>
      <image>
          <url>https://www.dancarlin.com/wp-content/uploads/2014/03/dc-homepage-cover-img.jpg</url>
          <title>Hardcore History</title>
          <link>https://www.dancarlin.com/hardcore-history-series/</link>
      </image>
      <description>
          The full length description for your podcast
      </description>
      <language>en-us</language>
      <atom:link href="https://raw.githubusercontent.com/sunabozu/podcast/master/podcast.xml" rel="self" type="application/rss+xml"/>
      <lastBuildDate>Fri, 01 Jan 2016 06:00:00 PDT</lastBuildDate>
      <itunes:author>Dan Carlin</itunes:author>
      <itunes:summary>
          The full length description for your podcast
      </itunes:summary>
      <itunes:subtitle>Short sentence about the podcast</itunes:subtitle>
      <itunes:owner>
          <itunes:name>Dan Carlin</itunes:name>
      </itunes:owner>
      <itunes:explicit>No</itunes:explicit>
      <itunes:keywords>
          comma,separated,key,words
      </itunes:keywords>
      <itunes:image href="https://www.dancarlin.com/wp-content/uploads/2014/03/dc-homepage-cover-img.jpg"/>
      <rawvoice:location>San Francisco, California</rawvoice:location>
      <rawvoice:frequency>Monthly</rawvoice:frequency>
      <itunes:category text="History"/>
      <pubDate>Fri, 01 Jan 2016 06:00:00 PDT</pubDate>
      ${podItems}
  </channel>
</rss>
  `

  console.log(podFeed)
  
}

ls().catch(console.error)