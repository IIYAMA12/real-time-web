function isPointInsideOfPolygon(n,o){for(var r=n[0],t=n[1],e=!1,i=0,f=o.length-1;i<o.length;f=i++){var g=o[i][0],l=o[i][1],a=o[f][0],h=o[f][1];l>t!=h>t&&r<(a-g)*(t-l)/(h-l)+g&&(e=!e)}return e}