class IniFile {

    static rsection = /\[(\w+)\]/;
    static rvalue = /(.*)=(.*)/;

    constructor(filename=null) {
        this._filename = filename;
        this._sections = new Map();
        this._sections.set('default', new Map());
    }

    get filename() {
        return this._filename;
    }

    get sections() {
        return this._sections;
    }

    set(section, key, value) {
        if (!this._sections.has(section))
            this._sections.set(section, new Map());

        this._sections.get(section).set(key, value);
    }

    get(section, key, dv=null) {
        if (!this._sections.has(section))
            return dv;

        return this._sections.get(section).get(key) || dv;
    }

    async parse(ns, filename=null) {
        let activeSection = this._sections.get['default'];
        filename = filename || this._filename;

        for (const line of ns.read(filename).split('\n')) {
            let m = line.match(IniFile.rsection);
            if (m) {
                activeSection = new Map();
                this._sections.set(m[1], activeSection);
                continue;
            }

            m = line.match(IniFile.rvalue);
            if (m) {
                activeSection.set(m[1].trim(), m[2].trim());
            }
        }
        this._filename = filename;
    }

    async save(ns, filename=null) {
        let content = "";
        filename = filename || this._filename;
        for(const [i, j] of this._sections) {
            if(j.size === 0)
                continue;

            content += `[${i}]\n`;
            for(const [k, l] of j) {
                content += `${k} = ${l}\n`;
            }
            content += "\n";
        }

        ns.write(filename, '');  // Force existance of file
        ns.clear(filename);
        ns.write(filename, content);
    }
}

export {IniFile};

