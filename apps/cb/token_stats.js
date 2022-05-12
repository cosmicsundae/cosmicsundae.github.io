var C, R, R_CB, Rpvt, T, fm, fs, indep_session, studio_session;

function token_rate(num_tokens=NaN, price = NaN) {
    //  get the price of a certain number of tokens
    token_price_dict = { 100: 10.99, 200: 20.99, 500: 44.99, 750: 62.99, 1000: 79.99, 1255: 99.99, 2025: 159.99 };
    num_token_list = Object.keys(token_price_dict);
    price_list = Object.values(token_price_dict);
    //  if num_tokens is not Nan,
    if (!isNaN(num_tokens)) {
        if (num_tokens < 100) {
            return token_price_dict[100] / 100;
        } else {
            // loop of num_token_list backwards
            for (var i = num_token_list.length - 1; i >= 0; i--) {
                if (num_tokens >= num_token_list[i]) {
                    console.log('num_tokens: ' + num_tokens);
                    console.log('CB rate level')
                    console.log('  # tokens: ' + num_token_list[i]);
                    console.log('  price: ' + price_list[i]);
                    return price_list[i] / num_token_list[i];
                }
            }

        }
    } else if (!isNaN(price)) {
        //  if price is not Nan,
        if (price < 10.99) {
            return 100;
        } else {
            // loop of price_list backwards
            for (var i = price_list.length - 1; i >= 0; i--) {
                if (price >= price_list[i]) {
                    console.log('price: ' + price);
                    console.log('CB rate level')
                    console.log('  # tokens: ' + num_token_list[i]);
                    console.log('  price: ' + price_list[i]);
                    return price_list[i] / num_token_list[i];
                }
            }
        }
    } else {
        return NaN;
    }

}

function chaturbate_rate(price) {
    return token_rate(NaN,price);
}


function to_hms(time) {
    /*
    convert minutes to hh:mm:ss
    */
    var h, m, s;
    // time = Number.parseFloat(time);
    h = Math.floor(time / 60);
    m = Math.floor(time - h * 60);
    // s = Math.floor(time - h * 60 * 60 - m * 60);
    return h + "h " + m + "m"; // + s;
}

function model_income_user(kw) {
    /*
    how much a model makes from a certain amount
    spent by a user
     */


    R = kw.R; // usd/token
    T = kw.T  // Number.parseInt((kw.C / kw.R)); // token
    // round to 2 decimal places
    return Number.parseFloat(T * kw.fm * kw.Rpay).toFixed(2);
}

function model_income_token(kw) {
    /*
    model income from tokens received
    */

    return kw.T * kw.fm * kw.Rpay;
}

function model_pvt_time(kw) {
    /*
    model total possible private time from tokens received
    */
    T = kw.T;
    Rpvt = kw.Rpvt;
    return to_hms(T / Rpvt);
}

function model_token_rate(kw) {
    /*
    income per token for a model
    */
    fm = kw.fm
    Rpay = kw.Rpay
    // round to 2 decimal places
    return Number.parseFloat(fm * Rpay).toFixed(2);
}

function model_pvt_dollar_per_min(kw) {
    /*
    how much the model makes from private time
    */

    fm = kw.fm;
    Rpvt = kw.Rpvt;
    Rpay = kw.Rpay;
    // round to 2 decimal places
    return Number.parseFloat(fm * Rpvt * Rpay).toFixed(2);
}

function direct_income(kw) {
    /*
    how much model makes if directly supported
    */

    return kw.C;
}

function direct_token_equiv(kw) {
    var model_rate, tokens;
    fm = kw.fm;
    C = kw.C;
    Rpay = kw.Rpay;

    model_rate = fm * Rpay;
    tokens = Number.parseInt(C / model_rate, 0);
    return tokens;
}

function direct_pvt_time(kw) {
    /*
    how much time is direct support in terms
    of equivalent private minutes
    */
    var rate;


    rate = model_pvt_dollar_per_min(kw);

    return to_hms(kw.C / rate);
}


// get value from html input element and assing to variable
console.log('===========================');
console.log('Date: ' + new Date().toLocaleString());


function output(message) {
    console.log(message)

    // Get the User cost
    input_C = parseFloat(document.getElementById("user_cost").value);
    C = input_C // USD
    R = chaturbate_rate(C) // USD / token

    // Get the number of Tokens from Cost and Rate
    T = Number.parseInt((C / R));
    document.getElementById("user_tokens").value = T;

    // Set model-studio split
    fs = 0.6;
    fm = parseFloat(document.getElementById("fm").value) / 100;

    // fm = 0.4;

    // Get the model private rate
    input_Rpvt = parseInt(document.getElementById("model_rate").value);
    document.getElementById("model_rate").value = input_Rpvt;
    Rpvt = input_Rpvt;

    // CB token to USD rate
    R_CB = 0.05;

    studio_session = {
        "C": C,
        "R": R,
        "T": T,
        "fm": fm,
        "fs": fs,
        "Rpay": R_CB,
        "Rpvt": Rpvt
    };
    indep_session = {
        "C": C,
        "R": R,
        "T": T,
        "fm": 1,
        "fs": 0,
        "Rpay": R_CB,
        "Rpvt": Rpvt
    };



    // new lines in console



    if (0) {


        console.log('User spends ' + C + ' USD');
        console.log('Tokens: ' + T);
        console.log('');
        console.log('Model in studio')
        console.log('time in private: ' + model_pvt_time(studio_session))
        console.log('income: $' + model_income_user(studio_session))
        console.log('real rate ($/min): ' + model_pvt_dollar_per_min(studio_session))

        console.log('')
        console.log('Model is independent')
        console.log('time in private: ' + model_pvt_time(indep_session))
        console.log('income: $' + model_income_user(indep_session))
        console.log('real rate ($/min): ' + model_pvt_dollar_per_min(indep_session))

        console.log('')
        console.log('Direct support')
        console.log('direct pvt min @ indep rates: ' + direct_pvt_time(indep_session))
        console.log('direct pvt min @ studio rate: ' + direct_pvt_time(studio_session))
        console.log('direct income: $' + direct_income(indep_session))
    }


    document.getElementById('user_spends').innerHTML = C;
    document.getElementById('user_cost2').innerHTML = C;
    document.getElementById('user_tokens').innerHTML = T;
    document.getElementById('user_tokens2').innerHTML = T;
    document.getElementById('studio_private_time').innerHTML = model_pvt_time(studio_session);
    document.getElementById('studio_income').innerHTML = model_income_user(studio_session);
    document.getElementById('studio_rate').innerHTML = model_pvt_dollar_per_min(studio_session);
    // document.getElementById('indep_private_time').innerHTML = model_pvt_time(indep_session);
    document.getElementById('indep_income').innerHTML = model_income_user(indep_session);
    document.getElementById('indep_rate').innerHTML = model_pvt_dollar_per_min(indep_session);
    document.getElementById('direct_income').innerHTML = direct_income(indep_session);
    document.getElementById('direct_private_time_studio').innerHTML = direct_pvt_time(studio_session);
    document.getElementById('direct_private_time_indep').innerHTML = direct_pvt_time(indep_session);
}

function token_change() {

    var tokens;
    tokens = document.getElementById("user_tokens").value;

    if (tokens != T) {
        console.log('# of tokens changed from ' + T + ' to ' + tokens);
        T = Number.parseInt(tokens);
        R = token_rate(T, NaN);

        console.log('new Tokens: ' + T);
        console.log('new rate: ' + R)

        C = Number.parseFloat(T * R).toFixed(2)
        document.getElementById("user_cost").value = C
        output('Tokens changes')
    }
}


function model_frac_change() {

    frac = parseFloat(document.getElementById("fm").value)/100;

    if (frac != fm) {
        console.log('model fraction changed from ' + fm + ' to ' + frac);

        console.log('new model fraction: ' + frac);
        fm = frac;
        output('Model fraction changes')
    }
}
