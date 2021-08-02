const Authorization = ({ formName, rules }) => {
    const form = document.forms[formName];

    let ruleState = {};

    const validation = (ipForm, rule) => {
        let ipVal = ipForm.value;
        const ipErr = ipForm.nextElementSibling;
        let errMess = null;
        let err = 0;

        let rules = ruleState[rule.ele];

        for (let test of rules) {
            errMess = test(ipVal);
            if (errMess) {
                err = 1;
                break;
            }
        }

        if (errMess) {
            ipForm.classList.add("border-danger");
            ipErr.textContent = errMess;
        }
        return !!err;
        // const isValid = rule.test(ipVal);
        // if (isValid) {
        //     ipErr.textContent = isValid;
        // }
    };

    if (form) {
        //submit
        Authorization.handleSubmit = function () {
            // console.log("form submit");
            let err = 0;
            rules.forEach((rule) => {
                const ipForm = form.querySelector(rule.ele);
                let res = validation(ipForm, rule);
                if (res) err = 1;
            });
            return !!err;
        };

        //lap lay cac rule
        rules.forEach((rule) => {
            const ipForm = form.querySelector(rule.ele);

            if (ipForm) {
                if (Array.isArray(ruleState[rule.ele])) {
                    ruleState[rule.ele].push(rule.test);
                } else {
                    ruleState[rule.ele] = [rule.test];
                }

                ipForm.onblur = () => {
                    validation(ipForm, rule);
                };

                ipForm.addEventListener("focus", () => {
                    const ipErr = ipForm.nextElementSibling;
                    ipForm.classList.remove("border-danger");
                    if (ipErr) ipErr.textContent = "";
                });
            }
        });
    }
};

Authorization.isRequired = function (select, mes) {
    return {
        ele: select,
        test: function (val) {
            return val.trim() ? null : mes || "Filed is Required!!";
        },
    };
};

Authorization.minLength = function (select, min = 6, mes) {
    return {
        ele: select,
        test: (val) => {
            return val.length >= min
                ? null
                : mes || `Minximum of password is ${min} charactors`;
        },
    };
};

Authorization.isEmail = function (select, mes) {
    return {
        ele: select,
        test: function (val) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
                ? null
                : mes || "Email is not valid!!";
        },
    };
};

Authorization.compare = function (select, tar) {
    return {
        ele: select,
        test: function (val) {
            return val === tar() ? null : "Không khớp vui lòng kiểm tra lại";
        },
    };
};

export default Authorization;
