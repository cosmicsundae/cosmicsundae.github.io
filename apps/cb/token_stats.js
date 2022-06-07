var C, R, Rpay, Rpvt, T, fm, fs, indep_session, studio_session, model_dict;

function token_rate(num_tokens = NaN, price = NaN) {
    //  get the price of a certain number of tokens
    token_price_dict = {
        100: 10.99,
        200: 20.99,
        500: 44.99,
        750: 62.99,
        1000: 79.99,
        1255: 99.99,
        2025: 159.99,
    };
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
                    // console.log('num_tokens: ' + num_tokens);
                    // console.log('CB rate level')
                    // console.log('  # tokens: ' + num_token_list[i]);
                    // console.log('  price: ' + price_list[i]);
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
                    // console.log('price: ' + price);
                    // console.log('CB rate level')
                    // console.log('  # tokens: ' + num_token_list[i]);
                    // console.log('  price: ' + price_list[i]);
                    return price_list[i] / num_token_list[i];
                }
            }
        }
    } else {
        return NaN;
    }
}

function chaturbate_rate(price) {
    return token_rate(NaN, price);
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

function model_income(kw) {
    /*
      how much a model makes from a certain amount
      spent by a user
       */

    return kw.T * kw.fm * kw.Rpay;
}


function model_pvt_time(kw) {
    /*
      model total possible private time from tokens received
      */
    return kw.T / kw.Rpvt;
}

function model_token_rate(kw) {
    /*
      income per token for a model
      */
    return kw.fm * kw.Rpay;
}

function model_pvt_dollar_per_min(kw) {
    /*
      how much the model makes from private time
      */
    return kw.fm * kw.Rpvt * kw.Rpay;
}

function direct_income(kw) {
    /*
      how much model makes if directly supported
      */

    return kw.C;
}

function direct_token_equiv(kw) {
    /*
        number of tokens equivalent to direct support
        */
    return kw.C / (kw.fm * kw.Rpay);
}

function direct_pvt_time(kw) {
    /*
      how much time is direct support in terms
      of equivalent private minutes
      */
    rate = model_pvt_dollar_per_min(kw);
    return kw.C / rate;
}

// get value from html input element and assing to variable
console.log("===========================");
console.log("Date: " + new Date().toLocaleString());


function initializeForm() {

    // initialize form using the default data
    console.log("Initializing form");
    // Cost to the user
    C = parseFloat(document.getElementById("user_spends").value); // USD

    // fraction of token value received by the model
    fm = parseFloat(document.getElementById("fm").value) / 100;
    fs = 1 - fm;

    // price of 1 minute of private time
    Rpvt = parseFloat(document.getElementById("model_rate").value); // USD/min

    // price of 1 token
    R = chaturbate_rate(C); // USD / token

    // Get the number of Tokens from Cost and Rate
    T = C / R;

    // CB token to USD rate // could make this a hidden setting for the future
    Rpay = 0.05;

    set_sessions();

    run_model()

    writeFormValues();

}

function set_sessions() {
    studio_session = {
        C: C,
        R: R,
        T: T,
        fm: fm,
        fs: fs,
        Rpay: Rpay,
        Rpvt: Rpvt,
    };
    // run parseFloat over all dictionary values
    studio_session = Object.fromEntries(
        Object.entries(studio_session).map(
            ([key, value]) => [key, parseFloat(value)]
        )
    );

    indep_session = {
        C: C,
        R: R,
        T: T,
        fm: 1,
        fs: 0,
        Rpay: Rpay,
        Rpvt: Rpvt,
    };
    // run parseFloat over all dictionary values
    indep_session = Object.fromEntries(
        Object.entries(indep_session).map(
            ([key, value]) => [key, parseFloat(value)]
        )
    );


}

function update(message) {
    console.log(message);

    // Get the User cost
    run_model()
    writeFormValues();
}


// run the model functions and put into a global dictionary
function run_model() {


    // Model income USD
    incomeStudio = model_income(studio_session);
    incomeIndep = model_income(indep_session);

    // Private time minutes
    pvtTimeStudio = model_pvt_time(studio_session);
    pvtTimeIndep = model_pvt_time(indep_session);

    // Token rate for model  USD/token
    tokenRateStudio = model_token_rate(studio_session);
    tokenRateIndep = model_token_rate(indep_session);

    // Private time rate - dollars per minute
    pvtDollarPerMinStudio = model_pvt_dollar_per_min(studio_session);
    pvtDollarPerMinIndep = model_pvt_dollar_per_min(indep_session);

    // Direct support income and token/private time equivalents
    directIncome = direct_income(studio_session);
    directTokenEquivStudio = direct_token_equiv(studio_session);
    directPvtTimeStudio = direct_pvt_time(studio_session);
    directTokenEquivIndep = direct_token_equiv(indep_session);
    directPvtTimeIndep = direct_pvt_time(indep_session);




    model_dict = {
        incomeStudio: incomeStudio,
        incomeIndep: incomeIndep,
        pvtTimeStudio: pvtTimeStudio,
        pvtTimeIndep: pvtTimeIndep,
        tokenRateStudio: tokenRateStudio,
        tokenRateIndep: tokenRateIndep,
        pvtDollarPerMinStudio: pvtDollarPerMinStudio,
        pvtDollarPerMinIndep: pvtDollarPerMinIndep,
        directIncome: directIncome,
        directTokenEquivStudio: directTokenEquivStudio,
        directPvtTimeStudio: directPvtTimeStudio,
        directTokenEquivIndep: directTokenEquivIndep,
        directPvtTimeIndep: directPvtTimeIndep,
    };
}


function writeFormValues() {

    if (0) {
        console.log("User spends " + C + " USD");
        console.log("Tokens: " + T);
        console.log("");
        console.log("Model in studio");
        console.log("time in private: " + model_dict.pvtTimeStudio);
        console.log("income: $" + model_dict.incomeStudio);
        console.log(
            "real rate ($/min): " + model_dict.pvtDollarPerMinStudio
        );

        console.log("");
        console.log("Model is independent");
        console.log("time in private: " + model_dict.pvtTimeIndep);
        console.log("income: $" + model_dict.incomeIndep);
        console.log(
            "real rate ($/min): " + model_dict.pvtDollarPerMinIndep
        );

        console.log("");
        console.log("Direct support");
        console.log(
            "direct pvt min @ indep rates: " + model_dict.directPvtTimeIndep
        );
        console.log(
            "direct pvt min @ studio rate: " + model_dict.directPvtTimeStudio
        );
        console.log("direct income: $" + model_dict.directIncome);
    }

    document.getElementById("user_spends").value = C.toFixed(2);
    document.getElementById("user_spends2").innerHTML = C.toFixed(2);
    document.getElementById("user_tokens").value = parseFloat(T).toFixed(0);
    document.getElementById("user_tokens2").innerHTML = parseFloat(T).toFixed(0);

    document.getElementById("private_time").value = parseFloat(model_dict.pvtTimeStudio).toFixed(0);
    document.getElementById("studio_private_time").innerHTML = to_hms(model_dict.pvtTimeStudio);
    document.getElementById("studio_income").value = model_dict.incomeStudio.toFixed(2);
    document.getElementById("studio_rate").innerHTML = model_dict.pvtDollarPerMinStudio.toFixed(2);

    // document.getElementById('indep_private_time').innerHTML = model_dict.pvtTimeIndep; // same as studio
    document.getElementById("indep_income").value = model_dict.incomeIndep.toFixed(2);
    document.getElementById("indep_rate").innerHTML = model_dict.pvtDollarPerMinIndep.toFixed(2);

    document.getElementById("direct_income").innerHTML = model_dict.directIncome.toFixed(2);
    document.getElementById("direct_private_time_studio").innerHTML = to_hms(model_dict.directPvtTimeStudio);
    document.getElementById("direct_private_time_indep").innerHTML = to_hms(model_dict.directPvtTimeIndep);

}





function changeCost() {
    cost = parseFloat(document.getElementById("user_spends").value);
    rate = parseFloat(token_rate(NaN, cost));

    if (cost != C) {

        console.log("Cost changed from " + C + " to " + cost);
        console.log("Rate changed from " + R + " to " + rate);

        C = cost;
        R = rate;
        T = C / R;

        set_sessions();
        update("Cost changed");
    }
}



function changeToken() {
    tokens = parseInt(document.getElementById("user_tokens").value);
    if (tokens != T) {
        
        console.log("# of tokens changed from " + T + " to " + tokens);

        rate = parseFloat(token_rate(tokens, NaN));
        console.log("Rate changed from " + R + " to " + rate);

        T = tokens;
        R = rate;
        C = T * R;

        set_sessions();
        update("# of tokens changed");
    }
}


function changeRpvt() {
    rate_pvt = parseFloat(document.getElementById("model_rate").value);

    if (rate_pvt != Rpvt) {
        console.log("Rpvt changed from " + Rpvt + " to " + rate_pvt);
        Rpvt = rate_pvt;

        set_sessions();
        update("Rpvt changed");
    }
}


function changeFM() {
    frac = parseFloat(document.getElementById("fm").value) / 100;

    if (frac != fm) {
        console.log("model fraction changed from " + fm + " to " + frac);

        console.log("new model fraction: " + frac);
        fm = frac;
        fs = 1 - frac;

        set_sessions();
        update("model fraction changed");
    }
}

function changeStudioIncome() {

    income = parseFloat(document.getElementById("studio_income").value);
    tokens = income / parseFloat(Rpay * fm);
    rate = parseFloat(token_rate(tokens, NaN));
    cost = tokens * rate;

    T = tokens;
    C = cost;
    R = rate;

    set_sessions()
    update("studio income changed");
}

function changeIndepIncome() {


    income = parseFloat(document.getElementById("indep_income").value);
    tokens = income / parseFloat(Rpay);
    rate = parseFloat(token_rate(tokens, NaN));
    cost = tokens * rate;

    T = tokens;
    C = cost;
    R = rate;

    set_sessions()
    update("indep income changed");
}

function changePrivateTime() {
    pvt_time = parseFloat(document.getElementById("private_time").value);
    tokens = pvt_time * parseFloat(Rpvt);
    rate = parseFloat(token_rate(tokens, NaN));
    cost = tokens * rate;

    // log debug values
    T = tokens;
    C = cost;
    R = rate;

    set_sessions()
    update("private time changed");
}
// shorturl.at/lpABO
