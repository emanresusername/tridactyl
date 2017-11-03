import {normalmode, insertmode} from './parsing'
import {messageActiveTab} from './messaging'

type ModeName = 'normal'|'insert'|'hint'

class State {
    modes = {
        normal: normalmode.parser,
        insert: insertmode.parser,
        hint: ke=>messageActiveTab('hinting_content', 'pushKey', [ke]),
    }

    mode: ModeName = 'normal'
}

const state = new State()
export {state as default}
