'use strict';

const
    ID = 0x50,
    ADDR = 0x29,
    COMMAND = 0xA0,
    C = {ALS: 0xE6, INT: 0xE7, NPALS: 0xEA},
    E = {NPIEN: 0x80, SAI: 0x40, AIEN: 0x10, AEN: 0x02, PON: 0x01},
    L = {FULLSPECTRUM: 0, VISIBLE: 1, INFRARED: 2},
    G = {LOW: 0x00, MED: 0x10, HIGH: 0x20, MAX: 0x30},
    I = {MS100: 0x00, MS200: 0x01, MS300: 0x02, MS400: 0x03, MS500: 0x04, MS600: 0x05},
    S = {AVALID: 0x01, AINT: 0x10, NPINTR: 0x20},
    R = {ENABLE: 0x00, CONTROL: 0x01, NPAILTL: 0x08, PERSIST: 0x0C, ID: 0x12, STATUS: 0x13, C0DATAL: 0x14},
    write = (tsl, reg, val) => !tsl._i2c.writeTo(ADDR, [COMMAND | reg].concat(val === undefined ? [] : [val])),
    read = (tsl, reg, bytes) => write(tsl, reg) && tsl._i2c.readFrom(ADDR, bytes),
    readAls = (tsl, off) => new DataView(read(tsl, R.C0DATAL, 4).buffer).getUint16(off, true),
    setControl = tsl => write(tsl, R.CONTROL, tsl._gain | tsl._int),
    setEnable = tsl => write(tsl, R.ENABLE, tsl._enabled),
    setInterrupt = (tsl, reg, lo, hi) => [lo, lo >> 8, hi, hi >> 8].forEach(val => write(tsl, reg++, val)),
    setPersist = (tsl, value) => write(tsl, R.PERSIST, value > 3 ? ~~(value / 5) % 15 + 3 : value % 4),
    isValidEnable = enable => (enable & 0x1C) === 0,
    isValidGain = gain => Object.keys(G).some(g => G[g] === gain),
    isValidIntegration = integration => Object.keys(I).some(i => I[i] === integration),
    handleAen = (tsl, cb) => tsl.isAlsEnabled() ? tsl.disable(E.AEN) && cb() && tsl.enable(E.AEN) : cb(),
    waitForValidAls = (tsl, cb, _) => _ = setInterval(() => tsl.isAlsValid() && !clearInterval(_) && cb.call(tsl), 10),
    isSaturated = (ch0, ch1, int) => [ch0, ch1].indexOf([0x8FFFF, 0xFFFF][~~int]) !== -1;

let TSL2591 = module.exports = function (i2c)
{
    this._i2c = i2c;

    if (!(this._i2c instanceof I2C)) {
        throw new Error('Parameter has to be a I2C object');
    } else if (this._i2c._options.bitrate > 400000 || this._i2c._options.bitrate < 1) {
        throw new Error('Supported bitrate of TSL2591 is 1Hz to 400KHz')
    } else if (read(this, R.ID, 1)[0] !== ID) {
        throw new Error('Device at given I2C port is not a TSL2591');
    }

    this._gain = this.getGain();
    this._int = this.getIntegration();
    this._enabled = read(this, R.ENABLE, 1)[0];

    this.setToSleep();
};

TSL2591.LIGHT = L;
TSL2591.GAIN = G;
TSL2591.INTEGRATIONTIME = I;
TSL2591.ENABLE = E;

TSL2591.prototype = {
    isSaiEnabled: () => !!(read(this, R.ENABLE, 1)[0] & E.SAI),
    isPersistIntEnabled: () => !!(read(this, R.ENABLE, 1)[0] & E.AIEN),
    isIntEnabled: () => !!(read(this, R.ENABLE, 1)[0] & E.NPIEN),
    isAlsEnabled: () => !!(read(this, R.ENABLE, 1)[0] & E.AEN),
    enable: enable => isValidEnable(enable) && (this._enabled = enable | E.AEN | E.PON, true) && setEnable(this),
    disable: disable => isValidEnable(this._enabled & ~disable) && (this._enabled &= ~disable, true) && setEnable(this),
    setToSleep: () => (this._enabled = 0, true) && setEnable(this),
    setIntegration: int => isValidIntegration(int) && (this._int = int, true) && setControl(this),
    setGain: gain => isValidGain(gain) && (this._gain = gain, true) && handleAen(this, setControl.bind(null, this)),
    getIntegration: () => read(this, R.CONTROL, 1)[0] & 0x07,
    getGain: () => read(this, R.CONTROL, 1)[0] & 0x30,
    clearInterrupt: () => write(this, C.NPALS),
    clearPersistInterrupt: () => write(this, C.ALS),
    clearAllInterrupts: () => write(this, C.INT),
    isAlsValid: () => !!(read(this, R.STATUS, 1)[0] & S.AVALID),
    hasIntOccured: () => !!(read(this, R.STATUS, 1)[0] & S.NPINTR),
    hasPersistIntOccured: () => !!(read(this, R.STATUS, 1)[0] & S.AINT),
    getLuminosity: (light, cb) => {
        let ch0, ch1, diff = (a, b, m) => m % 2 ? a - b : [a, b][~~!!m];

        this.enable();
        waitForValidAls(this, () => {
            ch0 = readAls(this, L.FULLSPECTRUM);
            ch1 = readAls(this, L.INFRARED);
            cb(isSaturated(ch0, ch1, this.getIntegration()) ? -1 : diff(ch0, ch1, light));
            !this.isIntEnabled() && !this.isPersistIntEnabled() && this.disable(E.AEN | E.PON);
        });
    },
    registerInterrupt: (low, high, persist) => {
        let np = ~~(persist === undefined);
        this.enable([E.AIEN, E.NPIEN][np]);
        setInterrupt(this, R.NPAILTL - (1 - np << 2), low, high);
        !np && setPersist(this, persist);
    }
};