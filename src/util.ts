/** Cache a function */
export function primCache(func) {
    const cache = new Map()
    return function inner(...args) {
        const cached = cache.get(args)
        if (cached) return cached
        else {
            const result = func(...args)
            cache.set(args, result)
            return result
        }
    }
}

/** Weakly cache a function that accepts a single object.

    Can't express a weak relation on multiple arguments without faffery.
*/
export function weakCachedOne(func) {
    const cache = new WeakMap()
    return function inner(args) {
        const cached = cache.get(args)
        if (cached) return cached
        else {
            const result = func(args)
            cache.set(args, result)
            return result
        }
    }
}

/* Musings.
async function aFor(asyncIterator, body) {
    while (true) {
        const iteration = await asyncIterator.anext()
        if (iteration.done) break
        else {
            const stop = body(iteration.value)
            if (stop) {
                asyncIterator.stop()
                break
            }
        }
    }
}

aFor(MsgIterator('keydown_background', 'pushKey'), keyEvent=>{
    normalmode.parser(msg.key)
}

class Callback2Generator {
    private buffer = []
    private waiting = []

    constructor(expectsCallback, private stop?) {
        function bufferPusher(...value) {
            if (waiting.length) {
                for (let waiter of waiting) {
                    waiter({value, done: false})
                }
            } else {
                buffer.push(args)
            }
        }
        if (removeCallback) {
            expectsCallback(bufferPusher)
        } else {
            this.stop = expectsCallback(bufferPusher)
        }
    }

    function next() {
        if (buffer.length) {
            const value = buffer.shift()
            return new Promise((resolve, error)=>resolve({value, done: false}))
        } else {
            return new Promise((resolve, error)=>waiting.push(resolve))
        }
    }
}
*/
