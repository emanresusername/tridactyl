/** Hint links.

    TODO:

    important
        Connect to input system
        Add Simulated clicking to activate()
        Gluing into tridactyl
        Clear all hints
    unimportant
        Frames
        Redraw on reflow
*/

import { elementsByXPath, isVisible } from './dom'
import { log } from './math'
import { permutationsWithReplacement, islice, izip, map } from './itertools'

let HINTS: Hint[] = []

/** For each hintable element, add a hintmark */
export function hintPage() {
    for (let [el, name] of izip(hintables(), hintnames())) {
        HINTS.push(new Hint(el, name))
    }
}

/** Array of hintable elements in viewport

    Elements are hintable if
        1. they can be meaningfully selected, clicked, etc
        2. they're visible
            1. Within viewport
            2. Not hidden by another element
*/
function hintables() {
    return [...elementsByXPath(HINTTAGS)].filter(isVisible)
}

/** vimperator-style minimal hint names */
function* hintnames(hintchars = HINTCHARS) {
    let taglen = 1
    while (true) {
        yield* map(permutationsWithReplacement(hintchars, taglen), e=>e.join(''))
        taglen++
    }
}

/** Place a flag by each hintworthy element */
class Hint {
    static readonly hintmother = document.createElement('div')
    private flag

    constructor(readonly target: Element, public name: string) {
        const rect = target.getClientRects()[0]
        this.flag = document.createElement('span')
        this.flag.textContent = name
        this.flag.className = 'Hint'
        this.flag.style.cssText = `
            top: ${rect.top}px;
            left: ${rect.left}px;
        `
        Hint.hintmother.appendChild(this.flag)
        target.classList.add('HintElem')
    }

    // These styles would be better with pseudo selectors. Can we do custom ones?
    // If not, do a state machine.
    set hidden(hide: boolean) {
        this.flag.hidden = hide
        if (hide) {
            this.active = false
            this.target.classList.remove('HintElem')
        } else
            this.target.classList.add('HintElem')
    }

    set active(activ: boolean) {
        if (activ) {
            this.target.classList.add('HintActive')
            this.target.classList.remove('HintElem')
        } else {
            this.target.classList.add('HintElem')
            this.target.classList.remove('HintActive')
        }
    }

    click() {
        throw "Not implemented!"
    }
}

/** Uniform length hintnames */
function* hintnames_uniform(n: number, hintchars = HINTCHARS) {
    if (n <= hintchars.length)
        yield* islice(hintchars[Symbol.iterator](), n)
    else {
        // else calculate required length of each tag
        const taglen = Math.ceil(log(n, hintchars.length))
        // And return first n permutations
        yield* islice(permutationsWithReplacement(hintchars, taglen), n)
    }
}

/* const HINTCHARS = 'hjklasdfgyuiopqwertnmzxcvb' */
const HINTCHARS = 'asdf'

// XPath.
const HINTTAGS = `
//input[not(@type='hidden' or @disabled)] |
//a |
//area |
//iframe  |
//textarea  |
//button |
//select |
//*[
    @onclick or 
    @onmouseover or 
    @onmousedown or 
    @onmouseup or 
    @oncommand or 
    @role='link'or 
    @role='button' or 
    @role='checkbox' or 
    @role='combobox' or 
    @role='listbox' or 
    @role='listitem' or 
    @role='menuitem' or 
    @role='menuitemcheckbox' or 
    @role='menuitemradio' or 
    @role='option' or 
    @role='radio' or 
    @role='scrollbar' or 
    @role='slider' or 
    @role='spinbutton' or 
    @role='tab' or 
    @role='textbox' or 
    @role='treeitem' or 
    @tabindex
]`

isVisible(document.documentElement)
islice('a',1)

hintPage()
document.body.appendChild(Hint.hintmother)

export function filter(fstr) {
    const active: Hint[] = []
    let foundMatch
    for (let h of HINTS) {
        if (!h.name.startsWith(fstr)) h.hidden = true
        else {
            if (! foundMatch) {
                h.active = true
                foundMatch = true
            }
            active.push(h)
        }

    }
    if (active.length == 1)
        active[0].click()
}

let filtstr = ''
addEventListener('keydown', e=>{filtstr+=e.key, filter(filtstr)})
