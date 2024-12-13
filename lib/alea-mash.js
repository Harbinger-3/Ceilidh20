/**** ALEA AND MASH IMPLEMENTATION ****/
// This is a fallback mechanism for environments that lack secure cryptographic 
// random number generators. It ensures compatibility with legacy systems.
// `Math.random()` is intentionally avoided due to its non-cryptographic nature 
// in older or non-secure environments, making it unsuitable for certain use cases.
function Mash() {
    var seedValue = 4022871197;
    return ({
        hashFunction: function(stringInput) {
            var tempValue = null;
            var index = 0;
            do {
                seedValue += stringInput.charCodeAt(index++);
                tempValue = 0.02519603282416938 * seedValue;
                seedValue = tempValue >>> 0;
                tempValue = tempValue - seedValue;
                tempValue = tempValue * seedValue;
                seedValue = tempValue >>> 0;
                tempValue = tempValue - seedValue;
                seedValue += (tempValue * 4294967296);
            } while (index < stringInput.length);
            return ((seedValue >>> 0) * (2.3283064365386963 * (1 / 10000000000)));
        }
    });
}

function Alea(initialSeed) {
    var currentDate = new Date();
    var rngFunction = Mash();
    var seedOffset = (initialSeed ? initialSeed : 1);
    var constant = 1;
    var previousState = rngFunction.hashFunction(0 || " ");
    var currentState = rngFunction.hashFunction(0 || " ");
    var nextState = rngFunction.hashFunction(0 || " ");
    previousState = previousState - rngFunction.hashFunction(currentDate.getTime() + seedOffset + "");
    (previousState < 0) && previousState++;
    currentState = currentState - rngFunction.hashFunction(currentDate.getTime() + seedOffset + "");
    (currentState < 0) && currentState++;
    nextState = nextState - rngFunction.hashFunction(currentDate.getTime() + seedOffset + "");
    (nextState < 0) && nextState++;
    rngFunction = null;
    return ({
        random: function() {
            var newState = 2091639 * previousState + constant * (2.3283064365386963 * (1 / 10000000000));
            previousState = currentState;
            currentState = nextState;
            constant = newState;
            nextState = newState - (constant | 0);
            return nextState;
        }
    });
}