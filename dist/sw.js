// everytime you change this cacheName it will make a new one 
// in cache storage, the activate event runs everytime this changes
const cacheName = "cacheV8";

// cache individutal files in array...
// sometimes better to cache whole response
// for big applications
    // not here becasue we are cashing the whole response

// call install event this is whee you want to handle caching assets
    self.addEventListener("install", async (eObj)=>{
                    console.log("Service Worker: Installed");
        // use eventObj .waituntil to wait for the event to 
        // be finished not just started
        // eventObj.waitUntil method is specifically used in the context of 
        // service workers so the install event won't be considered
        // fully finished until waitUntil completes it waits for the
        // waitUntil async stuff to finish before the service worker is 
        // considered installed
            // not here since we are caching the whole respone
    })
// call activate event
    self.addEventListener("activate", async (eObj)=>{
                    console.log("Service Worker: Activated");
        // as this runs everytime the version name changes you
        // will want to delete past cache here so you use resources
        // wisely so removing unwanted caches:
            eObj.waitUntil(
                // xx forgot to call immediately invoked function...
                // make sure to add () at the end everytime you make 
                // immediately invoked function
                    (async ()=>{
                        const cacheNames = await caches.keys();
                        cacheNames.map(cache =>{
                            if(cache !== cacheName){
                                                console.log("Service Worker Clearing Old Cache");
                                caches.delete(cache);
                            }
                        })
                    })()
            )
    })

// call fetch event fires off everytime request is made to this url
// so you can intercept it and do what ever you want here! kinda cool
// but usually this is where you send cache stuff if offline
    self.addEventListener("fetch", async (eObj)=>{
                                console.log("Service Worker Fetch Event Going");
        // respondWith is part of the fetch API in js and is built in, it can be
        // used in other places but it is primarily used in service workers
            eObj.respondWith(
                (async ()=>{
                    try{
                        // xxx when using async await instead of .then you need to 
                        // return the response from the respondWith method
                            const res = await fetch(eObj.request);
                            // make clone of response you use use .clone() method 
                            // instead of just setting a variable = to res since res could
                            // be a mutable object meaning that it can be altered and when you set
                            // another variable equal to it it might point to the same place in memory
                            // and so editing the clone could actually edit the actual respone
                                const resClone = res.clone();
                            // open cache and store response clone copy in it
                                const cacheObj = await caches.open(cacheName);
                                                        console.log("Website Served Live From Server")
                                cacheObj.put(eObj.request, resClone);
                                return res
                    }catch(error){
                        // match will load in requst from cache instead 
                        // of from server
                            // xxx when using async await instead of .then you need to 
                            // return the response from the respondWith method
                                                    console.log("Website Served From Cache")
                                return await caches.match(eObj.request);
                    }
                })()
        )
    })