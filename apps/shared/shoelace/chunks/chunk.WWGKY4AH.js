function m(n,e){function t(v){let f=n.getBoundingClientRect(),i=n.ownerDocument.defaultView,a=f.left+i.pageXOffset,u=f.top+i.pageYOffset,c=v.pageX-a,d=v.pageY-u;e!=null&&e.onMove&&e.onMove(c,d)}function r(){document.removeEventListener("pointermove",t),document.removeEventListener("pointerup",r),e!=null&&e.onStop&&e.onStop()}document.addEventListener("pointermove",t,{passive:!0}),document.addEventListener("pointerup",r),e!=null&&e.initialEvent&&t(e.initialEvent)}export{m as a};
