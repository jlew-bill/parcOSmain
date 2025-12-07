
import { Intent } from '../types';

export class ParcTalkInterpreter {
  static parse(input: string): Intent {
    const cmd = input.toLowerCase().trim();

    // -- OPCODES --

    if (cmd.includes('open') || cmd.includes('launch')) {
        let target = '';
        if (cmd.includes('sport')) target = 'sports';
        else if (cmd.includes('nil')) target = 'nil';
        else if (cmd.includes('creator')) target = 'creator';
        else if (cmd.includes('board')) target = 'board';
        
        return {
            opcode: 'OPEN_APP',
            args: { target },
            source: 'user',
            confidence: target ? 0.95 : 0.5
        };
    }

    if (cmd.includes('close')) {
        return {
            opcode: 'CLOSE_APP',
            args: { target: cmd.includes('all') ? 'all' : 'focused' },
            source: 'user',
            confidence: 1.0
        };
    }

    if (cmd.includes('snap')) {
        let position = 'left';
        if (cmd.includes('right')) position = 'right';
        if (cmd.includes('top')) position = 'top';
        if (cmd.includes('bottom')) position = 'bottom';
        if (cmd.includes('max') || cmd.includes('full')) position = 'maximize';

        return {
            opcode: 'SNAP_WINDOW',
            args: { position },
            source: 'user',
            confidence: 0.9
        };
    }

    if (cmd.includes('tile')) {
        return { opcode: 'TILE_WORKSPACE', args: {}, source: 'user', confidence: 0.9 };
    }

    if (cmd.includes('clean') || cmd.includes('desktop')) {
        return { opcode: 'CLEAN_DESKTOP', args: {}, source: 'user', confidence: 0.9 };
    }
    
    if (cmd.includes('next') || cmd.includes('prev')) {
        return { 
            opcode: 'NAVIGATE_STACK', 
            args: { direction: cmd.includes('next') ? 'next' : 'prev' }, 
            source: 'user', 
            confidence: 0.9 
        };
    }

    return { opcode: 'UNKNOWN', args: { raw: input }, source: 'user', confidence: 0 };
  }
}
