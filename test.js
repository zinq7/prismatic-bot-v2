String.prototype.multWithLetters = function (number) {
    let num = "", repStart = -1, repEnd = 0;
    for (let i = 0; i < this.length; i++) {
        if (!isNaN(this.at(i)) || this.at(i) == ".") {
            num += this.at(i); //get num
            repEnd = i; //always replace end of replacement
            if (repStart == -1) {
                repStart = i; //only do this once
            }
        }
    }
    num *= number;
    num = parseFloat(num.toFixed(10)); //remove uneccesary decimals

    return (this.slice(0, repStart) + num + this.slice(repEnd + 1));
}

//step 1: split elements
function bracketSplit(str) {
    let counter = -2, pos = 0;
    let arr = [];
    for (let i = 0; i < str.length; i++) {
        if (str.at(i) == "(") {
            counter++; //increment counter
            if (counter == -1) {
                //first case: add first coeff to array
                arr.push(str.substring(0, i));
                counter = 1;
                pos = i;
            } else if (counter == 1) {
                pos = i;
            }
        } else if (str.at(i) == ")") {
            counter--; //decrement
            //if we reached 0 (closed initial bracket)
            if (counter == 0) {
                //add it to our array
                arr.push(str.substring(pos, i + 1));
            }
        }
    }
    if (arr[0].at(0) != "-") {
        arr[0] = "+" + arr[0].substring(0); //add + to coeff of first one
    }

    return arr;
}

//step 2.0: get coeffs
function getCoeffs(str) {
    let builder = "";//builder
    const coeffs = []; //nums array
    for (let i = 0; i < str.length; i++) {
        if (!isNaN(str.at(i))) {
            builder += str.at(i); //add to build if it's a num
        } else {
            if (builder != "") {
                coeffs.push(builder); //push
                builder = ""; //reset builder
            }
        }
    }
    if (builder) coeffs.push(builder); //push last element if it exists

    return coeffs; // return
}

function factor(obj, fracName, coeffName) {
    let fullAns = [];
    let coeff = obj[coeffName]; // get component CoeffName

    for (let i = 0; i < obj[fracName].length; i++) {
        let str = getCoeffs(obj[fracName][i]);
        let gcf = 1;


        //loop through the factors
        for (let lows = 1; lows <= lowest(str); lows++) {
            //loop through all the terms
            for (let i = 0; i < str.length; i++) {
                //if it's a whole number
                if ((i / lows) % 1 == 0) {
                    //set the greatest common factor to lows (for now)
                    gcf = lows;
                }
            }
        }

        //once greatest common factor has been found, factor out
        coeff = (coeff + "").multWithLetters(gcf);
        str = str.map(x => x / gcf); //divide

        fullAns.push(str+"");
    }

    return { [coeffName]: (coeff), [fracName]: (fullAns) }; //object with same name as coedfff
}

//finds lowest num in a numeric array
function lowest(arr) {
    let lowest = arr[0];
    for (let i = 0; i < arr.length; i++) {
        lowest = (arr[i] < lowest) ? arr[i] : lowest;
    }
    return lowest;
}

let [tcoef, ...trest] = [...bracketSplit("4x(4+2)(5x-29y(2))")];

let fraction = {
    topC: tcoef,
    topR: trest,
    botC: 0,
    botR: 0
}

//return an object of this type to save 2x datatype

console.log(fraction);
for (const str of fraction.topR) {
    console.log(str);
    fraction = factor(fraction, 'topR', 'topC');
}

console.log(fraction);

