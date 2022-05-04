const sections = [{ "url": "/", "en": "Dashboard" }, { "url": "/inputs", "en": "Inputs" }
    , { "url": "/channels", "en": "Channels" }, { "url": "/admin", "en": "Admin" }];

const opers = JSON.parse('%OPERS%');
const variables = JSON.parse('%VARIABLES%');

    /*
const opers = [["=", false, true, false, false]
    , [">", true, false, false, false]
    , ["<", true, false, true, false]
    , ["!", false, false, true, true]
    , [">=", true, true, false, false]
    , ["<=", true, true, true, false]
    , ["!=", false, true, true, false]];
*/
/*
const variables = [
  { "id": 0, "code": "price", "type": "0" }
    , { "id": 1, "code": "price rank 9 h", "type": 0 }
    , { "id": 2, "code": "price rank 24 h", "type": 0 }
    , { "id": 3, "code": "night", "type": 50 }
    ,  {  "id": 4,"code": "winter day", "type": 51 }
];
*/
/*
const channels = [
    { "id_str": "Syöttö", "gpio": 5, "is_up": true, "wanna_be_up": true, "type": 2, "uptime_minimum": 120 }
    , { "id_str": "Tulistus", "gpio": 4, "is_up": false, "wanna_be_up": false, "type": 3, "uptime_minimum": 300 }];
*/

// https://stackoverflow.com/questions/7317273/warn-user-before-leaving-web-page-with-unsaved-changes
var formSubmitting = false;
var setFormSubmitting = function () {
    formSubmitting = true;
};
var submitChannelForm = function () {


    let stmtDivs = document.querySelectorAll("div[id^='std_']");
    //  let stmt_arr = {};
    if (stmtDivs && stmtDivs.length > 0) {
        for (let i = 0; i < stmtDivs.length; i++) {
            const divEl = stmtDivs[i];
            const fldA = divEl.id.split("_");
            const var_val = parseInt(document.getElementById(divEl.id.replace("std", "var")).value);
            const op_val = parseInt(document.getElementById(divEl.id.replace("std", "op")).value);
            if (var_val < 0 || op_val < 0)
                continue;

            //todo decimal, test  that number valid
            const const_val = parseFloat(document.getElementById(divEl.id.replace("std", "const")).value);
            //  stmt_arr[divEl.id.replace("std_", "")] = [var_val, op_val, const_val];
            saveStoreId = "stmts_" + fldA[1] + "_" + fldA[2];
            console.log(saveStoreId + "+ " + JSON.stringify([var_val, op_val, const_val]));
            saveStoreEl = document.getElementById(saveStoreId);
            let stmt_list = [];
            if (saveStoreEl.value) {
                stmt_list = JSON.parse(saveStoreEl.value);
            }
            stmt_list.push([var_val, op_val, const_val]);
            saveStoreEl.value = JSON.stringify(stmt_list);
        }

    }

    // alert(JSON.stringify(stmt_arr));
    //  document.getElementById("stmts_list").value = JSON.stringify(stmt_arr);


    alert("submitChannelForm");
    formSubmitting = true;

};
var isDirty = function () { return true; }


function addOption(el, value, text, selected = false) {
    var opt = document.createElement("option");
    opt.value = value;
    opt.selected = selected;
    opt.innerHTML = text
    // then append it to the select element
    el.appendChild(opt);
}
function populateStmtField(varFld) {
    if (varFld.options && varFld.options.length > 0) {
        //  alert(varFld.id + " already populated");
        return; //already populated
    }
    document.getElementById(varFld.id.replace("var", "const")).style.display = "none";
    document.getElementById(varFld.id.replace("var", "op")).style.display = "none";

    addOption(varFld, -2, "remove");
    addOption(varFld, -1, "select", true);

    for (var i = 0; i < variables.length; i++) {
        addOption(varFld, variables[i][0], variables[i][1]);
    }
  /*  for (variable in variables) {
        addOption(varFld, variables[variable]["id"], variables[variable]["code"]);
    }*/
}
function populateVariableSelects(field) {
    const selectEl = document.querySelectorAll("select[id^='var_']");
    for (let i = 0; i < selectEl.length; i++) {
        populateStmtField(selectEl[i]);
    }
}
function createElem(tagName, id = null, value = null, class_ = "", type = null) {
    const elem = document.createElement(tagName);
    if (id)
        elem.id = id;
    if (value)
        elem.value = value;
    if (class_) {
        for (const class_this of class_.split(" ")) {
            elem.classList.add(class_this);
        }

    }

    if (type)
        elem.type = type;
    return elem;
}
function addStmt(elBtn) {

    let div_to_search = elBtn.id.replace("addstmt_", "std_");
    const fldA = elBtn.id.split("_");
    const ch_idx = parseInt(fldA[1]);
    const cond_idx = parseInt(fldA[2]);

    let stmt_idx = -1;
    let stmtDivs = document.querySelectorAll("div[id^='" + div_to_search + "']");
    if (stmtDivs && stmtDivs.length > 0) {
        const fldB = stmtDivs[stmtDivs.length - 1].id.split("_");
        stmt_idx = parseInt(fldB[3]);
    }

    suffix = "_" + ch_idx + "_" + cond_idx + "_" + (stmt_idx + 1);

    lastEl = document.getElementById("std_" + ch_idx + "_" + cond_idx + "_" + stmt_idx);

    // create new element
    // const elem = document.createElement('p');
    //   <input class='fldtiny fldstmt inpnum' id='const" + suffix + "' type='text' value='0'>
    const sel_var = createElem("select", "var" + suffix, null, "fldstmt indent", null);
    sel_var.addEventListener("change", setVar);

    const sel_op = createElem("select", "op" + suffix, null, "fldstmt", null);
    sel_op.on_change = 'setOper(this)';
    const inp_const = createElem("input", "const" + suffix, 0, "fldtiny fldstmt inpnum", "text");

    const div_std = createElem("div", "std" + suffix, null, "divstament", "text");
    div_std.appendChild(sel_var);
    div_std.appendChild(sel_op);
    div_std.appendChild(inp_const);

    elBtn.parentNode.insertBefore(div_std, elBtn);

    populateStmtField(document.getElementById("var" + suffix));

}

function populateOper(el, var_this) {
    // alert(el.id);
    // alert(var_this);
    if (el.options.length == 0)
        addOption(el, -1, "select", true);
    if (el.options)
        while (el.options.length > 1) {
            el.remove(1);
        }

    if (var_this) {
        for (let i = 0; i < opers.length; i++) {
            //alert(variable);
            if (var_this["type"] >= 50 && !opers[i][5])
                continue;
            if (var_this["type"] < 50 && opers[i][5])
                continue;
            const_id = el.id.replace("op", "const");
            console.log(const_id);
            el.style.display = "block";
            document.getElementById(el.id.replace("op", "const")).style.display = (opers[i][5]) ? "none" : "block";
            addOption(el, opers[i][0],opers[i][1]);
        }

    }
    else {
        ;
    }

}
// set variable in dropdown select
function setVar(evt) {
    const el = evt.target;
    const fldA = el.id.split("_");
    ch_idx = parseInt(fldA[1]);
    cond_idx = parseInt(fldA[2]);
    stmt_idx = parseInt(fldA[3]);
    if (el.value > -1) {
        for (var i = 0; i < variables.length; i++) {
            if (variables[i][0] == el.value) {
                var_this = variables[i];
                break;
            }
        }
       // let var_this = variables[el.value];
        populateOper(document.getElementById(el.id.replace("var", "op")), var_this);
    }
    else if (el.value == -2) {
        // if (!document.getElementById("var_" + ch_idx + "_" + cond_idx + "_" + stmt_idx + 2) && stmt_idx>0) { //is last
        if (confirm("Confirm")) {
            //viimeinen olisi hyvä jättää, jos poistaa välistä niin numerot frakmentoituu
            var elem = document.getElementById(el.id.replace("var", "std"));
            elem.parentNode.removeChild(elem);
        }
        // }
    }

}
function setOper(el) {

}


function setEnergyMeterFields(val) { //
    idx = parseInt(val);

    var emhd = document.querySelector('#emhd');
    var empd = document.querySelector('#empd');
    var emhd = document.querySelector('#emhd');
    var emidd = document.querySelector('#emidd');
    var baseld = document.querySelector('#baseld');

    if ([1, 2, 3].indexOf(idx) > -1) {
        emhd.style.display = "block";
        empd.style.display = "block";
    } else {
        emhd.style.display = "none";
        empd.style.display = "none";
    }
    if ([2, 3].indexOf(idx) > -1)
        baseld.style.display = "block";
    else
        baseld.style.display = "none";

    if ([3].indexOf(idx) > -1) {
        empd.style.display = "block";
        emidd.style.display = "block";
    } else {
        empd.style.display = "none";
        emidd.style.display = "none";
    }

}
function initChannelForm() {
    let inputs = document.querySelectorAll("input");
    console.log("inputs.length:" + inputs.length);
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].id != inputs[i].name)
            console.log("id <> name  " + inputs[i].id + " != " + inputs[i].name);
        else
            console.log("id == name  " + inputs[i].id + " == " + inputs[i].name);
    }
   
    var chtype;
    for (var ch = 0; ch < CHANNELS; ch++) {
        //ch_t_%d_1
        //TODO: fix if more types coming
        chtype = document.getElementById('chty_' + ch).value;
        setChannelFieldsByType(ch, chtype);
    }
}

function setChannelFieldsByType(ch, chtype) {
    for (var t = 0; t < CHANNEL_TARGETS_MAX; t++) {
        divid = 'td_' + ch + "_" + t;
        var targetdiv = document.querySelector('#' + divid);
        var cbdiv = document.querySelector('#ctcbd_' + ch + "_" + t);
        var isTarget = (1 & chtype);
        var uptimediv = document.querySelector('#d_uptimem_' + ch);

        if (chtype == 0)
            uptimediv.style.display = "none";
        else
            uptimediv.style.display = "block";

        if (isTarget) {
            targetdiv.style.display = "block";
            cbdiv.style.display = "none";
        } else {
            targetdiv.style.display = "none";
            cbdiv.style.display = "block";
        }
    }
}
function initUrlBar(url) {
    var headdiv = document.getElementById("headdiv");

    var h1 = document.createElement('h1');
    h1.innerHTML = "Arska Node";
    headdiv.appendChild(h1);

    sections.forEach((sect, idx) => {
        if (url == sect.url) {
            var span = document.createElement('span');
            var b = document.createElement('b');
            b.innerHTML = sect.en;
            span.appendChild(b);
            headdiv.appendChild(span);
        }
        else {
            var a = document.createElement('a');
            var link = document.createTextNode(sect.en);
            a.appendChild(link);
            a.title = sect.en;
            a.href = sect.url;
            headdiv.appendChild(a);
        }

        if (idx < sections.length - 1) {
            var sepa = document.createTextNode(" | ");
            headdiv.appendChild(sepa);
        }
    });
    // <a href="/">Dashboard</a> | <span> <b>Admin</b> </span>

}

//
function initForm(url) {
    initUrlBar(url);
    if (url == '/admin') {
        initWifiForm();
    }
    else if (url == '/channels') {
        initChannelForm();
    }
    var footerdiv = document.getElementById("footerdiv");
    if (footerdiv) {
        footerdiv.innerHTML = "<a href='http://netgalleria.fi/rd/?arska-wiki' target='arskaw'>Arska Wiki</a> | <a href='http://netgalleria.fi/rd/?arska-states' target='arskaw'>States</a> | <a href='http://netgalleria.fi/rd/?arska-rulesets'  target='arskaw'>Rulesets</a>";
    }
}

function compare_wifis(a, b) {
    return ((a.rssi > b.rssi) ? -1 : 1);
}

function initWifiForm() {
    var wifisp = JSON.parse(wifis);
    wifisp.sort(compare_wifis);
    var wifi_sel = document.getElementById("wifi_ssid");
    wifisp.forEach(wifi => {
        if (wifi.id) {
            var opt = document.createElement("option");
            opt.value = wifi.id;
            // if (wifi.id == wifi_ssid) //from constants via template processing
            //     opt.selected = true;
            opt.innerHTML = wifi.id + ' (' + wifi.rssi + ')';
            wifi_sel.appendChild(opt);
        }
    })
}

function setChannelFields(obj) {
    if (obj == null)
        return;
    const fldA = obj.id.split("_");
    ch = parseInt(fldA[1]);
    var chtype = obj.value;
    setChannelFieldsByType(ch, chtype);
}

//beforeAdminSubmit
function checkAdminForm() {
    document.querySelector('#ts').value = Date.now() / 1000;
    var http_password = document.querySelector('#http_password').value;
    var http_password2 = document.querySelector('#http_password2').value;
    if (http_password && http_password.length < 5) {
        alert('Password too short, minimum 5 characters.');
        return false;
    }
    if (http_password != http_password2) {
        alert('Passwords do not match!');
        return false;
    }
    return true;
}

function clearText(elem) {
    elem.value = '';
}
// Ruleset processing
function processRulesetImport(evt) {
    if (!evt.target.id.startsWith("rules_"))
        return
    const fldA = evt.target.id.split("_");
    channel_idx = parseInt(fldA[1]);

    let data = evt.clipboardData.getData('text/plain');
    try {
        obj = JSON.parse(data);
        evt.target.value = 'x';
        document.getElementById(evt.target.id).value = '';
        if ((!'rulesetId' in obj) || !('rules' in obj)) {
            alert("Invalid ruleset data.");
            return;
        }
        let import_it = confirm("Do you want to import rule set over existing rules?");

    } catch (e) {
        alert('Invalid ruleset (' + e + ')'); // error in the above string (in this case, yes)!
        evt.target.value = '';
        return false;
    }

    for (let i = 0; i < CHANNELS; i++) {
        let rule_states_e = document.getElementById("st_" + channel_idx + "_" + i);
        let rule_onoff_cb = document.getElementById("ctcb_" + channel_idx + "_" + i);
        let rule_target_e = document.getElementById("t_" + channel_idx + "_" + i);

        if (obj["rules"].length >= i + 1) {
            rule_states_e.value = JSON.stringify(obj["rules"][i]["states"]).replace("[", "").replace("]", "");
            rule_onoff_cb.checked = obj["rules"][i]["on"];
            if (obj["rules"][i]["target"]) {
                rule_target_e.value = obj["rules"][i]["target"];
            }
            else {
                rule_target_e.value = 0;
            }
        }
        else {
            rule_states_e.value = '';
            rule_onoff_cb.checked = false;
            rule_target_e.value = 0;

        }
    }
}
let rs1 = document.getElementById('rs1')
document.addEventListener('paste', e => {
    processRulesetImport(e);
})

