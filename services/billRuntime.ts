
import { ParcTalkInterpreter } from './parcTalk';
import { useOSStore } from '../store/useOSStore';

// The Runtime singleton that connects the Interpreter to the Store
export const BILL = {
  execute: (command: string) => {
    const intent = ParcTalkInterpreter.parse(command);
    console.log('[BILL] Parsed Intent:', intent);
    
    const feedback = useOSStore.getState().dispatch(intent);
    
    // Also update CMFK state based on successful interaction
    // (Simulating cognitive improvement on successful command)
    if (intent.opcode !== 'UNKNOWN') {
         // Increase Knowingness, Decrease Fog
         useOSStore.setState(prev => ({
             cmfk: {
                 ...prev.cmfk,
                 k: Math.min(1, prev.cmfk.k + 0.05),
                 f: Math.max(0, prev.cmfk.f - 0.05)
             }
         }));
    }

    return {
        intent,
        feedback
    };
  }
};
