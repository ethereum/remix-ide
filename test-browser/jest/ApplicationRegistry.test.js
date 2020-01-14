import { ApplicationRegistry } from './ApplicationRegistry';

describe('Application Registry', ()=>{
    const names = [];
    const appManager = {
        activate: (name) => { names.push(name) },
        isActivated: (name) => names.includes(name),
        log: (message)=> { }
    }
    const app = {
        methods: [],
        event: {
            on: (name, cb)=> cb,
            off: (name) => name
        },
        call(method) {
            if (this.methods.includes(method)) {
              if (this[method]) {
                return this[method]()
              } else {
                throw new Error(`Method ${method} is exposed, but not implemented`)
              }
            } else {
              throw new Error(`Method ${method} is not exposed`)
            }
        }
    }

    it('should create an instance of ApplicationRegistry', ()=>{
        const appRegistry = new ApplicationRegistry(appManager);

        expect(appRegistry).toBeInstanceOf(ApplicationRegistry);
    });

    it('should register new name ApplicationRegistry.register', ()=>{
        const appRegistry = new ApplicationRegistry(appManager);

        appRegistry.plugins = {};
        appRegistry.register('Test', app);
        expect(appManager.isActivated('Test')).toEqual(true);
    });

    it('should execute ApplicationRegistry.call method', ()=>{
        const appRegistry = new ApplicationRegistry(appManager);

        appRegistry.plugins = {};
        appRegistry.register('Test', app);
        try{
            appRegistry.call('Test', 'Test Method');
        }catch(error){
            expect(error.message).toEqual('Method Test Method is not exposed')
        }
    });

    it('should execute ApplicationRegistry.on method', ()=>{
        const appRegistry = new ApplicationRegistry(appManager);

        appRegistry.plugins = {};
        appRegistry.register('Test', app);

        const cb = appRegistry.on('Test', 'Test Event', ()=>{})

        expect(typeof cb === 'function');
    });
    
    it('should execute ApplicationRegistry.off method', ()=>{
        const appRegistry = new ApplicationRegistry(appManager);

        appRegistry.plugins = {};
        appRegistry.register('Test', app);

        const cb = appRegistry.off('Test', 'Test Event')

        expect(cb).toEqual('Test Event');
    });
});