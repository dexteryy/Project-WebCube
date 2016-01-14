
import * as request from 'superagent';

document.domain = 'flipboard.com';

request.post('https://fbchina.flipboard.com/v1/users/updateFeed/186976631')
  // .withCredentials()
  .set('X-Flipboard-User-Agent', 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.76 Mobile Safari/537.36 Flipboard/3.3.16-debug/2801,3.3.16-debug.2801d,Dec 9, 2015 6:42:39 PM, debug, china')
  .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
  // .set('Content-Length', '370')
  // .set('Host', 'fbchina.flipboard.com')
  // .set('Connection', 'Keep-Alive')
  // .set('User-Agent', 'okhttp/2.6.0')
  .query({
    userid: '186976631',
    udid: '7e62dda127e5c33b5625ecb9204c753b94b37b1d',
    tuuid: 'a10ad99d-d3a7-458b-b57b-8da3db2f1b57',
    ver: '3.3.16-debug.2801d',
    device: 'aphone-LGE-Nexus+5-22',
    lang: 'en',
    locale: 'en_US',
    screensize: '4.6',
    locale_cg: 'zh_CN',
    jobid: 'a-0dm2plv6',
    sections: 'auth%2Fflipboard%2Fcoverstories',
    limit: '10',
    wasAutoRefresh: 'false',
    flipster: '1',
    variant: 'china',
  })
  .send('item=flipboard-Y3r4ys8ZRcK4qE-OQCvKaw%3Aa%3A3153968-14520074561106803960&item=flipboard-FOM7zNQRTkeLc_rX2KmW0g%3Aa%3A3153968-14520060262685399741&item=flipboard-aeq_VTJgSVqnpc2YJZj3pA%3Aa%3A3153968-14520453383926197471&item=flipboard-T38LyqktRCWVnnmiZofgrg%3Aa%3A3153968-14519420662725363446&item=flipboard-fLRYspRES0abdxMDesPvYg%3Aa%3A3153968-14520274043670477965&item=flipboard-KfgIzqPGTvSwO3CGEjhcIQ%3Aa%3A3153968-14519561202330852804&item=flipboard-zi7afBROQbOOjtJCnl9GeQ%3Aa%3A3153968-14520275693405559477&item=flipboard-1QL67VsOSKq9drRA0cAuEA%3Aa%3A3153968-14520182144252427789&item=flipboard-Q8YBn0flQPaqeTn7cKnD0g%3Aa%3A3153968-14519420481967480861&item=flipboard-e51tfP3FSIW4omXPxKl_8g%3Aa%3A3153968-14520455312060167857')
  .end((err, res) => {
    if (err) {
      throw err;
    }
    console.info(res);
  });
