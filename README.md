espruino-tsl2591
================

Usage example
-------------
```javascript
const TSL2591 = require('https://raw.githubusercontent.com/PaddeK/espruino-tsl2591/master/tsl2591.js');

// Setup I2C
I2C1.setup({scl: B8, sda: B9, bitrate: 400000});

// Get sensor object
let sensor = new TSL2591(I2C1);

// Log sensor value
sensor.getLuminosity(TSL2591.LIGHT.FULLSPECTRUM, console.log);
```


.



Value reference
---------------
- **_ENABLE_**

    | Name        | Value _(hex)_ | Description                                          
    |:-----------:|:-------------:| -----------------
    | **PON**     | 0x01          | Power on/off TSL2591 internal oscillator.
    | **AEN**     | 0x02          | Enable/disable TSL2591 ambient light sensor functions.
    | **AIEN**    | 0x10          | Enable/disable TSL2591 persist interrupt capabilities.
    | **SAI**     | 0x40          | Enable/disable TSL2591 sleep after interrupt capability.
    | **NPIEN**   | 0x80          | Enable/disable TSL2591 no persist interrupt capabilities.
.   
- **_GAIN_**

    | Name        | Value _(hex)_ | Description                                          
    |:-----------:|:-------------:| -----------------
    | **LOW**     | 0x00          | Sets the gain of the internal amplifiers to 1 _(both channels)_.
    | **MED**     | 0x10          | Sets the gain of the internal amplifiers to 24.5 _(both channels)_.
    | **HIGH**    | 0x20          | Sets the gain of the internal amplifiers to 400 _(both channels)_.
    | **MAX**     | 0x30          | Sets the gain of the internal amplifiers to 9200 _(channel 0)_ and 9900 _(channel 1)_.
.  
- **_INTEGRATIONTIME_**

    | Name        | Value _(hex)_ | Description                                          
    |:-----------:|:-------------:| -----------------
    | **MS100**   | 0x00          | Sets the internal integration time to 100ms _(both channels)_.
    | **MS200**   | 0x01          | Sets the internal integration time to 200ms _(both channels)_.
    | **MS300**   | 0x02          | Sets the internal integration time to 300ms _(both channels)_.
    | **MS400**   | 0x03          | Sets the internal integration time to 400ms _(both channels)_.
    | **MS500**   | 0x04          | Sets the internal integration time to 500ms _(both channels)_.
    | **MS600**   | 0x05          | Sets the internal integration time to 600ms _(both channels)_.
.
- **_LIGHT_**

    | Name             | Value _(hex)_ | Description                                          
    |:----------------:|:-------------:| -----------------
    | **FULLSPECTRUM** | 0x00          | Calculate luminosity of the full spectrum _(visible and infrared)_.
    | **VISIBLE**      | 0x01          | Calculate luminosity for visible light only.
    | **INFRARED**     | 0x02          | Calculate luminosity for infrared light only.


.


Function reference
------------------
- **_constructor_ (** I2C **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_I2C_**         | _object_      | Must be `instanceof` _I2C_ with a bitrate of 1Hz to 400KHz.

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _object_          | A instance of the TSL2591 class.
.
- **_clearAllInterrupts_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Clears all pending interrupts (persist and no persist).
.
- **_clearInterrupt_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Clear only pending no persist interrupts.
.
- **_clearPersistInterrupt_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Clear only pending persist interrupts.
.
- **_disable_ (** disable **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_disable_**     | _number_      | Disable capabilities of the TSL2591. See _**ENABLE**_ value reference for valid values _(pass sum to disable multiple capabilities at once)_.

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _void_            | Technically returns always true, but do not use it or rely on it.
.
- **_enable_ (** enable **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_enable_**      | _number_      | Enable capabilities of the TSL2591. See _**ENABLE**_ values reference for valid values _(pass sum to disable multiple capabilities at once)_. Enforces **PON** and **AEN** to be enabled!

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _void_            | Technically returns always true, but do not use it or rely on it.
.
- **_getGain_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _number_          | Returns the current active gain value. See _**GAIN**_ value reference for valid values.
.
- **_getIntegration_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _number_          | Returns the current active integration value. See _**INTEGRATIONTIME**_ value reference for valid values.
.
- **_getLuminosity_ (** LIGHT, callback **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_LIGHT_**       | _number_      | Light spectrum to get luminosity of. See _**LIGHT**_ values reference for valid values.
    | **_callback_**    | _function_    | A callback function which gets called with the resulting luminosity value as parameter. If the TSL2591 is oversaturated the luminosity is fixed at -1.

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _void_            | Returns undefined.
    
    _**Note:**_ This function takes care of enabling the TSL2591 beforehand and disabling it afterwards _(Respects enabled interrupt capabilities)_.

.
- **_hasIntOccured_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if a no persist interrupt has occured.Returns false otherwise.
.
- **_hasPersistIntOccured_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if a persist interrupt has occured. Returns false otherwise.
.
- **_isAlsEnabled_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if _**AEN**_ is currently active. Returns false otherwise.        
.
- **_isAlsValid_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if at least one integration cycle is completed since _**AEN**_ was enabled and valid values can be red from the TSL2591. Returns false otherwise. _Note:_ `getLuminosity` takes care of this internally.        
.
- **_isIntEnabled_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if no persist interrupt capabilities are enabled. Returns false otherwise.        
.
- **_isPersistIntEnabled_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if persist interrupt capabilities are enabled. Returns false otherwise.     
.
- **_isSaiEnabled_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if _**SAI**_ capability is enabled. Returns false otherwise.        
.
- **_registerInterrupt_ (** low, high, _persist_ **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_low_**         | _number_      | Lower threshold value _(Max. 65535)_. If luminosity crosses below this value an interrupt is triggered on the interrupt pin.
    | **_high_**        | _number_      | Upper threshold value _(Max. 65535)_. If luminosity crosses above this value an interrupt is triggered on the interrupt pin.
    | _persist_         | _number_      | Optional value which specifies how many consecutive out-of-range luminosity values have to be measured before a interrupt is triggered. If not set a interrupt is triggered immediately after a out-of-range measurement. See _**Note**_ for valid values.

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _boolean_         | Returns true if set interrupt was a persist interrupt. Returns false otherwise.

    _**Note:**_
    
    | Value | Description                                          
    |------:| -----------------
    | 0     | Every measurement generates an interrupt.
    | 1     | Any out-of-range measurement generates an interrupt.
    | 2     | 2 consecutive out-of-range measurements generate an interrupt.
    | 3     | 3 consecutive out-of-range measurements generate an interrupt.
    | 4     | 5 consecutive out-of-range measurements generate an interrupt.
    | 5     | 10 consecutive out-of-range measurements generate an interrupt.
    | 6     | 15 consecutive out-of-range measurements generate an interrupt.
    | 7     | 20 consecutive out-of-range measurements generate an interrupt.
    | 8     | 25 consecutive out-of-range measurements generate an interrupt.
    | 9     | 30 consecutive out-of-range measurements generate an interrupt.
    | 10    | 35 consecutive out-of-range measurements generate an interrupt.
    | 11    | 40 consecutive out-of-range measurements generate an interrupt.
    | 12    | 45 consecutive out-of-range measurements generate an interrupt.
    | 13    | 50 consecutive out-of-range measurements generate an interrupt.
    | 14    | 55 consecutive out-of-range measurements generate an interrupt.
    | 15    | 60 consecutive out-of-range measurements generate an interrupt.

.
- **_setGain_ (** gain **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_gain_**        | _number_      | Sets the gain value effective after the current integration cycle. See _**GAIN**_ value reference for valid values.

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _void_            | Technically returns always true, but do not use it or rely on it.        
    
    _**Note:**_ This function takes care of disabling **AEN** beforehand and enabling it afterwards if necessary. This is done to prevent irregular spikes in measurements while changing gain values.    
.
- **_setIntegration_ (** int **)**    

    | Parameters        | Type          | Description                                          
    | ----------------- |:-------------:| -----------------------------------------------------------
    | **_int_**         | _number_      | Sets the integration time value effective after the current integration cycle. See _**INTEGRATIONTIME**_ value reference for valid values.

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _void_            | Technically returns always true, but do not use it or rely on it.        
.
- **_setToSleep_ ()**    

    | Return type       | Description
    | ----------------- | -----------------------------------------------------------------------------------------------                                          
    | _void_            | Technically returns always true, but do not use it or rely on it.        

    _**Note:**_ Short hand for `disable(ENABLE.NPIEN | ENABLE.SAI | ENABLE.AIEN | ENABLE.AEN | ENABLE.PON)`