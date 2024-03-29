+++
title = "Edit TCS Treadmill Runs with tcxmill"
date = 2019-10-18
[taxonomies]
tags = ['running', 'code']
+++

Get tcxmill [here](https://www.github.com/nref/tcxmill)
  
Editing activity distance is one of the [most requested Strava features](https://support.strava.com/hc/en-us/search?utf8=%E2%9C%93&query=edit+distance&commit=Search), and I created a way to do it for treadmill runs.  
  
If you, like me, track treadmill workouts with a Garmin watch which uploads to Strava, then you've likely experienced this kind of data:  
  
![](https://1.bp.blogspot.com/-Hs1nLrF0jCo/XaoMEmiFOdI/AAAAAAAAJrc/VUXjSj1I4-weLjjnnvmsb-dFK9yD0iS_wCLcBGAsYHQ/s640/summary-before.png)

![](https://1.bp.blogspot.com/-LxgF0tK2jR8/XaoMCjKfulI/AAAAAAAAJrk/HCwWRRdGDygeulmOJFUSRQ2Ri0zQ0_VpACEwYBhgL/s640/charts-before.png)

Above is a recent treadmill workout of mine. I ran 30km, i.e. 18.6 miles. My  [Forerunner 945](https://buy.garmin.com/en-US/US/p/621922#overview)  and  [HRM-Run](https://buy.garmin.com/en-US/US/p/530376#overview)  recorded an extraordinary 42.54 miles at an absurd pace of 3:12/mi.

The impossibility of this metric is hyperbolized by Eliud Kipchoge subsequently [breaking the two-hour marathon barrier](https://www.nytimes.com/2019/10/12/sports/eliud-kipchoge-marathon-record.html) at a pace of 4:34/mi. To avoid ridicule from my Strava friends, I gladly kept this activity private until I could correct it.  
  
In addition to being wildly inaccurate, the pace data is also noisy.  
  
Below is the corrected data after running tcxmill. You can see that the distance and pace are correct, and the workout structure is reflected accurately.  

![](https://1.bp.blogspot.com/-mbXDGITsPkY/XaoMEFxmcCI/AAAAAAAAJrs/Vs5GZBrnMdIHL74BsxqSTevBBEFxSB4mgCEwYBhgL/s640/summary-after.png)

![](https://1.bp.blogspot.com/-9-xtDOatTE4/XaoMCnOiMzI/AAAAAAAAJrg/-_9B6pqWb-4h-KK2Hlbn8lRVkk804BiKQCEwYBhgL/s640/charts-after.png)

The only requirements are that you know and follow your workout structure. Instructions are on [the GitHub page](https://www.github.com/nref/tcxmill). Go ahead and try it out!

