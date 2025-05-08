
// initialize sql lite
window.sqlite3InitModule().then(function (sqlite3) {
    console.log("sqlite3: ", sqlite3)
    // create database
    const capi = sqlite3.capi/*C-style API*/,
        oo = sqlite3.oo1/*high-level OO API*/;
    console.log("sqlite3 version", capi.sqlite3_libversion(), capi.sqlite3_sourceid());
    const db = new oo.DB("/mydb.sqlite3", 'ct');
    // create tables
    create_table(db)
    populate_data(db)
    // populate tables
    document.getElementById("prepopulated_data").addEventListener("click", function (e) {
        console.log("Populate Data");
        populate_data()
    })
    let current_user = ""
    let basket_id = ""
    let sa_name = ""
    let cc_number = ""

    // registration form listener
    const registration_form = document.getElementById("registration");
    if (registration_form) {
        document.getElementById("registration").addEventListener("submit", function (e) {
            e.preventDefault();
            var formData = new FormData(registration_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = insert_into_customer(db, formDataObject)
            console.log(result)
        })
    }

    const login_form = document.getElementById("login");
    if (login_form) {
        document.getElementById("login").addEventListener("submit", function (e) {
            e.preventDefault();
            var formData = new FormData(login_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = login_customer(db, formDataObject)
            console.log(result)
            if (result)
                current_user = formDataObject["login_email"]
            console.log(current_user)
        })
    }
    const registration_information = document.getElementById("registration_information_text_area")
    document.getElementById("refresh_login").addEventListener("click", function(e) {
        if (current_user != "" ) {
            console.log("update registration_information textbox")
            result = get_customer_attributes(db, current_user)
            registration_information.value = result
        }
        
    })
    const edit_registration_form = document.getElementById("edit_registration")
    document.getElementById("edit_registration").addEventListener("submit", function (e) {
        if (current_user != "" && edit_registration_form) {
            e.preventDefault();
            var formData = new FormData(edit_registration_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = update_customer(db, formDataObject, current_user)
            console.log(result)
        }
    })
    const credit_card_information = document.getElementById("credit_card_information_text_area")
    document.getElementById("refresh_credit_card").addEventListener("click", function(e) {
        if (current_user != "" ) {
            console.log("update credit_card_information textbox")
            result = get_credit_cards(db, current_user)
            credit_card_information.value = result
        }
        
    })
    const edit_credit_card_form = document.getElementById("edit_credit_card")
    document.getElementById("edit_credit_card").addEventListener("submit", function (e) {
        if (current_user != "" && edit_credit_card_form) {
            e.preventDefault();
            var formData = new FormData(edit_credit_card_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = update_credit_card(db, formDataObject, current_user)
            console.log(result)
        }
    })

    const shipping_address_information = document.getElementById("shipping_address_information_text_area")
    document.getElementById("refresh_shipping_address").addEventListener("click", function(e) {
        if (current_user != "" ) {
            console.log("update shipping_address_information textbox")
            result = get_shipping_address(db, current_user)
            shipping_address_information.value = result
        }
    })
    const edit_shipping_address_form = document.getElementById("edit_shipping_address")
    document.getElementById("edit_shipping_address").addEventListener("submit", function (e) {
        if (current_user != "" && edit_shipping_address_form) {
            e.preventDefault();
            var formData = new FormData(edit_shipping_address_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = update_shipping_address(db, formDataObject, current_user)
            console.log(result)
        }
    })

    const basket_information = document.getElementById("basket_text_area")
    document.getElementById("refresh_basket_information").addEventListener("click", function(e) {
        if (current_user != "" && basket_id !== "" ) {
            console.log("update basket_information textbox")
            result = get_basket_information(db, current_user, basket_id)
            console.log(result)
            basket_information.value = result
        }
    })

    document.getElementById("new_basket").addEventListener("click", function(e) {
        if (current_user != "" && basket_id !== "" ) {
            console.log("start new basket_information")
            basket_id = ""
            basket_information.value = ""
            check_order_information.value = ""
        }
    })

    const edit_basket_form = document.getElementById("edit_basket")
    document.getElementById("edit_basket").addEventListener("submit", function (e) {
        if (current_user != "" && edit_basket_form) {
            e.preventDefault();
            var formData = new FormData(edit_basket_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            basket_id = update_basket(db, formDataObject, current_user, basket_id)
            console.log(basket_id)
        }
    })

    const place_order_form = document.getElementById("place_order")
    document.getElementById("place_order").addEventListener("submit", function (e) {
        if (current_user != "" && basket_id !== "" && place_order_form && basket_information.value !== "") {
            e.preventDefault();
            var formData = new FormData(place_order_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = place_order(db, formDataObject, current_user, basket_id, basket_information.value)
            cc_number = result[0]
            sa_name = result[1]
            console.log("place order submit handler ",cc_number, sa_name)
        }
    })

    const check_order_information = document.getElementById("check_order_information")
    document.getElementById("refresh_order_information").addEventListener("click", function (e) {
        if (current_user !== "" && cc_number !== "" && sa_name !== "" && basket_id != "") {
            transaction_info = check_order(db, current_user, basket_id, cc_number, sa_name)
            console.log(transaction_info)
            check_order_information.value = transaction_info
        }
    })

    document.getElementById("order_delivered").addEventListener("click", function (e) {
        if (current_user !== "" && cc_number !== "" && sa_name !== "" && basket_id != "") {
            transaction_info = change_transaction_status(db, current_user, basket_id, cc_number, sa_name, "DELIVERED")
        }
    })

    document.getElementById("order_not_delivered").addEventListener("click", function (e) {
        if (current_user !== "" && cc_number !== "" && sa_name !== "" && basket_id != "") {
            transaction_info = change_transaction_status(db, current_user, basket_id, cc_number, sa_name, "NOT DELIVERED")
        }
    })

    const view_transaction_history_textarea = document.getElementById("view_transaction_history_textarea")
    const view_transaction_history_form = document.getElementById("view_transaction_history")
    document.getElementById("view_transaction_history").addEventListener("submit", function (e) {
        if (current_user != "" && view_transaction_history_form) {
            e.preventDefault();
            var formData = new FormData(view_transaction_history_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            let result = view_transactions_table(db, formDataObject, current_user)
            console.log(result)
            view_transaction_history_textarea.value = result
        }
    })

    
    
    
    
    

    // Stats
    // total credit_card_amount
    const credit_card_total_amount = document.getElementById("credit_card_total_amount_text_area")
    if (credit_card_total_amount) {
        credit_card_total_amount.value = query_credit_card_total_amount(db)
    }
    const credit_card_total_amount_button = document.getElementById("credit_card_total_amount_button")
    if (credit_card_total_amount_button && credit_card_total_amount) {
        credit_card_total_amount_button.addEventListener("click", function (e) {
            credit_card_total_amount.value = query_credit_card_total_amount(db)
        })
    }

    // best customers
    const best_customers = document.getElementById("best_customers_text_area")
    if (best_customers) {
        best_customers.value = query_best_customers(db)
    }
    const best_customers_button = document.getElementById("best_customers_button")
    if (best_customers_button && best_customers) {
        best_customers_button.addEventListener("click", function (e) {
            best_customers.value = query_best_customers(db)
        })
    }

    // frequent_products
    const frequent_products = document.getElementById("frequent_products_text_area")
    if (frequent_products) {
        frequent_products.value = query_frequent_products(db, "0000-00-00", "2025-05-08")
    }
    const frequent_products_form = document.getElementById("frequent_products");
    if (frequent_products_form) {
        document.getElementById("frequent_products").addEventListener("submit", function (e) {
            e.preventDefault();
            var formData = new FormData(frequent_products_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            // if begin is empty - set to beginning of time
            if (formDataObject["frequent_products_form_begin_date"] == "") {
                formDataObject["frequent_products_form_begin_date"] = "0000-00-00"
            }
            // if end is empty - set to current day
            if (formDataObject["frequent_products_form_end_date"] == "") {
                formDataObject["frequent_products_form_end_date"] = "2025-05-08"
            }
            frequent_products.value = query_frequent_products(db, formDataObject["frequent_products_form_begin_date"], formDataObject["frequent_products_form_end_date"])
        })
    }

    // distinct customers
    const distinct_customers = document.getElementById("distinct_customers_text_area")
    if (distinct_customers) {
        distinct_customers.value = query_distinct_customers(db, "0000-00-00", "2025-05-08")
    }
    const distinct_customers_form = document.getElementById("distinct_customers");
    if (distinct_customers_form) {
        document.getElementById("distinct_customers").addEventListener("submit", function (e) {
            e.preventDefault();
            var formData = new FormData(distinct_customers_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            // if begin is empty - set to beginning of time
            if (formDataObject["distinct_customers_form_begin_date"] == "") {
                formDataObject["distinct_customers_form_begin_date"] = "0000-00-00"
            }
            // if end is empty - set to current day
            if (formDataObject["distinct_customers_form_end_date"] == "") {
                formDataObject["distinct_customers_form_end_date"] = "2025-05-08"
            }
            distinct_customers.value = query_distinct_customers(db, formDataObject["distinct_customers_form_begin_date"], formDataObject["distinct_customers_form_end_date"])
        })
    }

    // maximum basket
    const maximum_basket = document.getElementById("maximum_basket_text_area")
    if (distinct_customers) {
        maximum_basket.value = query_maximum_basket(db, "0000-00-00", "2025-05-08")
    }
    const maximum_basket_form = document.getElementById("maximum_basket");
    if (maximum_basket_form) {
        document.getElementById("maximum_basket").addEventListener("submit", function (e) {
            e.preventDefault();
            var formData = new FormData(maximum_basket_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            // if begin is empty - set to beginning of time
            if (formDataObject["maximum_basket_form_begin_date"] == "") {
                formDataObject["maximum_basket_form_begin_date"] = "0000-00-00"
            }
            // if end is empty - set to current day
            if (formDataObject["maximum_basket_form_end_date"] == "") {
                formDataObject["maximum_basket_form_end_date"] = "2025-05-08"
            }
            maximum_basket.value = query_maximum_basket(db, formDataObject["maximum_basket_form_begin_date"], formDataObject["maximum_basket_form_end_date"])
        })
    }

    // distinct customers
    const average_product_price = document.getElementById("average_product_price_text_area")
    if (average_product_price) {
        average_product_price.value = query_average_product_price(db, "0000-00-00", "2025-05-08")
    }
    const average_product_price_form = document.getElementById("average_product_price");
    if (distinct_customers_form) {
        document.getElementById("average_product_price").addEventListener("submit", function (e) {
            e.preventDefault();
            var formData = new FormData(average_product_price_form);
            const formDataObject = Object.fromEntries(formData);
            console.log(Object.fromEntries(formData));
            // if begin is empty - set to beginning of time
            if (formDataObject["average_product_price_form_begin_date"] == "") {
                formDataObject["average_product_price_form_begin_date"] = "0000-00-00"
            }
            // if end is empty - set to current day
            if (formDataObject["average_product_price_form_end_date"] == "") {
                formDataObject["average_product_price_form_end_date"] = "2025-05-08"
            }
            average_product_price.value = query_average_product_price(db, formDataObject["average_product_price_form_begin_date"], formDataObject["average_product_price_form_end_date"])
        })
    }


    // demo1(sqlite3);
})

// result = place_order(db, current_user, basket_id, basket_information.value)
// result = get_transaction_information(db, current_user, basket_id)

// const get_transaction_information = (db, current_user, basket_id) => {

// }
// basket_id = place_order(db, formDataObject, current_user, basket_id, basket_information.value) 

const change_transaction_status = (db, current_user, basket_id, cc_number, sa_name, transaction_status) => {
    let cid = ""
    let result = ""
    try {
        console.log("place_order get_cid: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select cid from CUSTOMER where email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                cid = row[0]
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    console.log(`update TRANSACTION_TABLE set ttag= \'${transaction_status}\' where cid = \'${cid}\' and saname = \'${sa_name}\' and bid = \'${basket_id}\' and ccnumber = \'${cc_number}\'`)

    try {
        db.exec({
            sql: `update TRANSACTION_TABLE set ttag= \'${transaction_status}\' where cid = \'${cid}\' and saname = \'${sa_name}\' and bid = \'${basket_id}\' and ccnumber = \'${cc_number}\'`,
        });
    } catch (error) {
        console.log(error)
    }
}

const check_order = (db, current_user, basket_id, ccnumber, sa_name) => {
    let cid = ""
    let result = ""
    try {
        console.log("place_order get_cid: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select cid from CUSTOMER where email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                cid = row[0]
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    try {
        console.log("get_order_transaction: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select * from TRANSACTION_TABLE where bid = \'${basket_id}\' AND ccnumber = \'${ccnumber}\' AND cid = \'${cid}\' AND saname = \'${sa_name}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                result += row.toString()+"\n"
            }.bind({ counter: 0 })
        });
    return result
    } catch (error) {
        console.log(error)
    }
}

const place_order = (db, formDataObject, current_user, basket_id, basket_info_string) => {
    let basket_info_array = basket_info_string.split("\n")
    let cid = ""
    let ccnumber_cid_array = []
    let saname_cid_array = []
    let ccnumber_exists = false
    let saname_exists = false
    let bid = basket_id
    if (formDataObject["place_order_ccnumber"] === "" || formDataObject["place_order_saName"] === "")
        return
    
    try {
        console.log("place_order get_cid: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select cid from CUSTOMER where email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                cid = row[0]
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }

    try {
        console.log("place_order get_ccnumbers: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select ccnumber from CREDIT_CARD where storedcardcid = \'${cid}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                ccnumber_cid_array.push(row[0])
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    try {
        console.log("place_order get_saname: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select saname from SHIPPING_ADDRESS where cid = \'${cid}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                saname_cid_array.push(row[0])
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    for (let i = 0; i < ccnumber_cid_array.length; i++) {
        if (ccnumber_cid_array[i] === formDataObject["place_order_ccnumber"])
            ccnumber_exists = true
    }
    for (let i = 0; i < saname_cid_array.length; i++) {
        if (saname_cid_array[i] === formDataObject["place_order_saName"])
            saname_exists = true
    }
    // check if ccnumber exists for user, otherwise add
    // check if saName exists for user, otherwise add
    if (!ccnumber_exists) {
        try {
            db.exec({
                sql: "insert into CREDIT_CARD(CCNUMBER,SECNUMBER, OWNERNAME, CCTYPE, BILADDRESS, EXPDATE, STOREDCARDCID) values ($a,$b,$c,$d,$e,$f,$g)",
                bind: { $a: formDataObject["place_order_ccnumber"], $b: formDataObject["place_order_secnumber"], $c: formDataObject["place_order_ownerName"], $d: formDataObject["place_order_cctype"], $e: formDataObject["place_order_biladdress"], $f: formDataObject["place_order_expDate"], $g: cid }
            });
        } catch (e) {
            console.log(e)
        }
        
    }
    if (!saname_exists) {
        try {
            db.exec({
                sql: "insert into SHIPPING_ADDRESS(CID,SANAME, RECIPIENTNAME, STREET, SNUMBER, CITY, ZIP, STATE, COUNTRY) values ($a,$b,$c,$d,$e,$f,$g,$h,$i)",
                bind: { $a: cid, $b: formDataObject["place_order_saName"], $c: formDataObject["place_order_recipient"], $d: formDataObject["place_order_street"], $e: formDataObject["place_order_snumber"], $f: formDataObject["place_order_city"], $g: formDataObject["place_order_zip"],  $h: formDataObject["place_order_state"], $i: formDataObject["place_order_country"]}
            });
        } catch (e) {
            console.log(e)
        }
    }
    console.log(formDataObject["place_order_ccnumber"],formDataObject["place_order_saName"])
    if (bid !== "") {
        try {
            db.exec({
                sql: "insert into TRANSACTION_TABLE(BID, CCNUMBER, CID, SANAME, TDATE, TTAG) values ($a,$b,$c,$d,$e,$f)",
                bind: { $a: bid, $b: formDataObject["place_order_ccnumber"], $c: cid, $d: formDataObject["place_order_saName"], $e: "2025-05-08",  $f: "Confirmed"}
            });
        } catch (e) {
            console.log(e)
        }
    }
    let result = [formDataObject["place_order_ccnumber"], formDataObject["place_order_saName"]]
    return result
}

const view_transactions_table = (db, formDataObject, current_user) => {
    let result = ""
    condition_statement = ""
    // get transactions by name
    if (formDataObject["view_transaction_history_fname"] !== "") {
        condition_statement += `fname =\'${formDataObject["view_transaction_history_fname"]}\' AND `
    }
    if (formDataObject["view_transaction_history_lname"] !== "") {
        condition_statement += `lname =\'${formDataObject["view_transaction_history_lname"]}\' AND `
    }
    // get transactions by cid
    if (formDataObject["view_transaction_history_fname"] === "" && formDataObject["view_transaction_history_lname"] === "") {
        condition_statement += `email = \'${current_user}\' AND `
    }
    // single product name
    if (formDataObject["view_transaction_history_pid"] !== "") {
        condition_statement += `APPEARS_IN.pid =\'${formDataObject["view_transaction_history_pid"]}\' AND `
    }
    // date range
    if (formDataObject["view_transaction_history_sdate"] !== "") {
        condition_statement += `TRANSACTION_TABLE.TDATE >=\'${formDataObject["view_transaction_history_sdate"]}\' AND `
    }
    else {
        condition_statement += `TDATE >=\'0000-00-00\' AND `
    }
    if (formDataObject["view_transaction_history_edate"] !== "") {
        condition_statement += `TRANSACTION_TABLE.TDATE <=\'${formDataObject["view_transaction_history_edate"]}\' AND `
    }
    else {
        condition_statement += `TDATE <=\'2025-05-08\' AND `
    }
    condition_statement = condition_statement.substring(0,condition_statement.length-5)
    console.log(condition_statement)
    try {
        console.log("get_transaction_history: ",current_user)
        // where ${condition_statement}
        db.exec({
            sql: `select * from TRANSACTION_TABLE NATURAL JOIN CUSTOMER NATURAL JOIN APPEARS_IN where ${condition_statement}`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                result+=row.toString()+"\n"
            }.bind({ counter: 0 })
        });
    return result
    } catch (error) {
        console.log(error)
    }
}


const update_basket = (db, formDataObject, current_user, basket_id) => {
    // create basket
    let cid;
    let bid = basket_id;
    if (bid === "") {
        console.log("create basket")
        try {
            console.log("get_basket_information: ",current_user, basket_id)
            bid = "B" + Math.random().toString(16).slice(2)
            db.exec({
                sql: `select cid from CUSTOMERS WHERE email = \'${current_user}\'`,
                rowMode: 'array', // 'array' (default), 'object', or 'stmt'
                callback: function (row) {
                    console.log("row ", ++this.counter, "=", row);
                    cid = `${row[0]}`
                }.bind({ counter: 0 })
            });
            db.exec({
                sql: "insert into BASKET(CID,BID) values ($a,$b)",
                bind: { $a : cid, $b: bid, }
            });
        } catch (error) {
            console.log(error)
        }
    }
    if (formDataObject["edit_basket_pid"] !== "" && formDataObject["edit_basket_quantity"] !== "") {
        let product_price = 0.0
        let offer_price = 0.0
        let status = ""
        let error = false
        let insert = true
        try {
            console.log("edit_basket: ",current_user, basket_id)
            // get price data for pid - first product or offer_product

            db.exec({
                sql: `select pprice from PRODUCT WHERE pid = \'${formDataObject["edit_basket_pid"]}\'`,
                rowMode: 'array', // 'array' (default), 'object', or 'stmt'
                callback: function (row) {
                    console.log("row ", ++this.counter, "=", row);
                    product_price = row[0]
                }.bind({ counter: 0 })
            });
            db.exec({
                sql: `select offerprice from OFFER_PRODUCT WHERE pid = \'${formDataObject["edit_basket_pid"]}\'`,
                rowMode: 'array', // 'array' (default), 'object', or 'stmt'
                callback: function (row) {
                    console.log("row ", ++this.counter, "=", row);
                    offer_price = row[0]
                }.bind({ counter: 0 })
            });
            db.exec({
                sql: `select status from CUSTOMER WHERE email = \'${current_user}\'`,
                rowMode: 'array', // 'array' (default), 'object', or 'stmt'
                callback: function (row) {
                    console.log("row ", ++this.counter, "=", row);
                    status = `${row[0]}`
                }.bind({ counter: 0 })
            });
            if (status === "" && offer_price == 0.0 && product_price == 0.0)
                return
            if (status !== "regular" && offer_price != 0.0 && product_price != 0.0)
                product_price=offer_price
            console.log(basket_id, formDataObject["edit_basket_pid"],formDataObject["edit_basket_pid"],product_price)
            // check if appears in
            db.exec({
                sql: `select count(*) from APPEARS_IN WHERE bid = \'${bid}\' and pid = \'${formDataObject["edit_basket_pid"]}\'`,
                rowMode: 'array', // 'array' (default), 'object', or 'stmt'
                callback: function (row) {
                    console.log("row ", ++this.counter, "=", row);
                    insert = row[0] == 0? true: false
                }.bind({ counter: 0 })
            });
            if (insert) {
                db.exec({
                    sql: "insert into APPEARS_IN(BID,PID, Quantity, PriceSold) values ($a,$b, $c, $d)",
                    bind: { $a : bid, $b: formDataObject["edit_basket_pid"], $c: formDataObject["edit_basket_quantity"], $d: product_price}
                });
            } else {
                db.exec({
                    sql: `update APPEARS_IN set quantity=\'${formDataObject["edit_basket_quantity"]}\', pricesold = \'${product_price}\' where bid = \'${bid}\'and pid =\'${formDataObject["edit_basket_pid"]}\'`
                });
            }
            
            basket_id = bid;
        } catch (error) {
            console.log(error)
        }
        return basket_id
    }
    // add items to basket
}
const get_basket_information =(db, current_user, basket_id) => {
    let result = ""
    try {
        console.log("get basket_attributes...");
        console.log("get_basket_information: ",current_user, basket_id)
        db.exec({
            sql: `select bid, pid, quantity, pricesold from APPEARS_IN where bid = \'${basket_id}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                result += `${row[0]},${row[1]},${row[2]},${row[3]}\n`
            }.bind({ counter: 0 })
        });
        return result
    } catch (error) {
        console.log(error)
    }
    
}

const get_shipping_address = (db, current_user) => {
    let result = []
    try {
        console.log("get shipping_address_attributes...");
        console.log(current_user)
        db.exec({
            sql: `select * FROM SHIPPING_ADDRESS NATURAL JOIN CUSTOMER WHERE email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                for (let i = 0; i < 9; i++) {
                    result += `${row[i]}\n`
                }
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    return result
}

const check_shipping_address = (db, cid, saname, current_user) => {
    let result = []
    console.log(typeof(result))
    try {
        console.log("get customer_attributes...");
        console.log(current_user)
        db.exec({
            sql: `select cid, saname FROM SHIPPING_ADDRESS NATURAL JOIN CUSTOMER WHERE email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                result.push(`${row[0]},${row[1]}`)
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    console.log(result)
    const compare_key = `${cid},${saname}`
    console.log(compare_key)
    for (let i = 0; i < result.length; i++) {
        if (result[i] === compare_key)
            return true;
    }
    return false;
}

const update_shipping_address = (db, formDataObject, current_user) => {
    console.log("edit shipping_address_attributes...");
    console.log(formDataObject)
    let update_statement = "set "
    let valid_sa_key = false;
    if (formDataObject["edit_shipping_address_cid_to_edit"]!== "" && formDataObject["edit_shipping_address_saname_to_edit"]!== "" ) {
        valid_sa_key = check_shipping_address(db, formDataObject["edit_shipping_address_cid_to_edit"], formDataObject["edit_shipping_address_saname_to_edit"],current_user)
    }
    // console.log("update credit card valid cc number", valid_cc_number)
    console.log(valid_sa_key)
    if (!valid_sa_key)
        return;
    // if (formDataObject["edit_shipping_address_cid"] != "") {
    //     update_statement += `cid = \'${formDataObject["edit_shipping_address_cid"]}\',`
    // }
    if (formDataObject["edit_shipping_address_saname"] != "") {
        update_statement += `saname = \'${formDataObject["edit_shipping_address_saname"]}\',`
    }
    if (formDataObject["edit_shipping_address_recipientName"] != "") {
        update_statement += `recipientName = \'${formDataObject["edit_shipping_address_recipientName"]}\',`
    }
    if (formDataObject["edit_shipping_address_street"] != "") {
        update_statement +=  `street = \'${formDataObject["edit_shipping_address_street"]}\',`
    }
    if (formDataObject["edit_shipping_address_snumber"] != "") {
        update_statement +=  `snumber = \'${formDataObject["edit_shipping_address_snumber"]}\',`
    }
    if (formDataObject["edit_shipping_address_city"] != "") {
        update_statement += `city = \'${formDataObject["edit_shipping_address_city"]}\',`
    }
    if (formDataObject["edit_shipping_address_zip"] != "") {
        update_statement += `zip = \'${formDataObject["edit_shipping_address_zip"]}\',`
    }
    if (formDataObject["edit_shipping_address_state"] != "") {
        update_statement += `state = \'${formDataObject["edit_shipping_address_state"]}\',`
    }
    if (formDataObject["edit_shipping_address_country"] != "") {
        update_statement += `country = \'${formDataObject["edit_shipping_address_country"]}\',`
    }
    console.log(update_statement)
    if (update_statement == "set ")
        return;
    update_statement = update_statement.substring(0,update_statement.length-1)
    console.log(update_statement)
    try {
        
        db.exec({
            sql: `update SHIPPING_ADDRESS ${update_statement} where cid = \'${formDataObject["edit_shipping_address_cid_to_edit"]}\' and saname = \'${formDataObject["edit_shipping_address_saname_to_edit"]}\'`,
        });
    } catch (error) {
        console.log(error)
    }
}

const get_credit_cards = (db, current_user) => {
    let result = []
    try {
        console.log("get customer_attributes...");
        console.log(current_user)
        db.exec({
            sql: `select * FROM CREDIT_CARD JOIN CUSTOMER WHERE CREDIT_CARD.STOREDCARDCID = CUSTOMER.CID AND email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                for (let i = 0; i < 7; i++) {
                    result += `${row[i]}\n`
                }
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    return result
}
const check_credit_card = (db, ccnumber, current_user) => {
    let result = []
    console.log(typeof(result))
    try {
        console.log("get customer_attributes...");
        console.log(current_user)
        db.exec({
            sql: `select * FROM CREDIT_CARD JOIN CUSTOMER WHERE CREDIT_CARD.STOREDCARDCID = CUSTOMER.CID AND email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                result.push(`${row[0]}`)
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        if (result[i] === ccnumber)
            return true;
    }
    return false;
}
const update_credit_card = (db, formDataObject, current_user) => {
    console.log("edit credit_card_attributes...");
    console.log(formDataObject)
    let valid_cc_number = false;
    if (formDataObject["edit_credit_card_ccnumber_to_edit"]!= "") {
        valid_cc_number = check_credit_card(db, formDataObject["edit_credit_card_ccnumber_to_edit"], current_user)
    }
    // console.log("update credit card valid cc number", valid_cc_number)
    if (!valid_cc_number)
        return;
    let update_statement = "set "
    if (formDataObject["edit_credit_card_ccnumber"] != "") {
        update_statement += `ccnumber = \'${formDataObject["edit_credit_card_ccnumber"]}\',`
    }
    if (formDataObject["edit_credit_card_secnumber"] != "") {
        update_statement += `secnumber = \'${formDataObject["edit_credit_card_secnumber"]}\',`
    }
    if (formDataObject["edit_credit_card_ownername"] != "") {
        update_statement += `ownername = \'${formDataObject["edit_credit_card_ownername"]}\',`
    }
    if (formDataObject["edit_credit_card_cctype"] != "") {
        update_statement +=  `cctype = \'${formDataObject["edit_credit_card_cctype"]}\',`
    }
    if (formDataObject["edit_credit_card_bilAddress"] != "") {
        update_statement +=  `biladdress = \'${formDataObject["edit_credit_card_bilAddress"]}\',`
    }
    if (formDataObject["edit_credit_card_expDate"] != "") {
        update_statement += `expdate = \'${formDataObject["edit_credit_card_expDate"]}\',`
    }
    if (formDataObject["edit_credit_card_storedcardcid"] != "") {
        update_statement += `storedcardcid = \'${formDataObject["edit_credit_card_storedcardcid"]}\',`
    }

    if (update_statement == "set ")
        return;
    update_statement = update_statement.substring(0,update_statement.length-1)
    try {
        
        db.exec({
            sql: `update CREDIT_CARD ${update_statement} where ccnumber = \'${formDataObject["edit_credit_card_ccnumber_to_edit"]}\'`,
        });
    } catch (error) {
        console.log(error)
    }
}

const update_customer = (db, formDataObject, current_user) => {

    console.log("edit customer_attributes...");
    console.log(formDataObject)
    let update_statement = "set "
    if (formDataObject["edit_registration_fname"] != "") {
        update_statement += `fname = \'${formDataObject["edit_registration_fname"]}\',`
    }
    if (formDataObject["edit_registration_lname"] != "") {
        update_statement += `lname = \'${formDataObject["edit_registration_lname"]}\',`
    }
    if (formDataObject["edit_registration_email"] != "") {
        update_statement += `email = \'${formDataObject["edit_registration_email"]}\',`
    }
    if (formDataObject["edit_registration_address"] != "") {
        update_statement +=  `address = \'${formDataObject["edit_registration_address"]}\',`
    }
    if (formDataObject["edit_registration_phone"] != "") {
        update_statement +=  `phone = \'${formDataObject["edit_registration_phone"]}\',`
    }
    if (formDataObject["edit_registration_status"] != "") {
        update_statement += `status = \'${formDataObject["edit_registration_status"]}\',`
    }

    if (update_statement == "set ")
        return;
    update_statement = update_statement.substring(0,update_statement.length-1)
    console.log(update_statement)
    try {
        
        db.exec({
            sql: `update CUSTOMER ${update_statement} WHERE email = \'${current_user}\'`,
        });
    } catch (error) {
        console.log(error)
    }

}

const get_customer_attributes = (db, current_user) => {
    let result = []
    try {
        console.log("get customer_attributes...");
        db.exec({
            sql: `select * from CUSTOMER WHERE email = \'${current_user}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                for (let i = 0; i < 7; i++) {
                    result += `${row[i]}\n`
                }
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    return result
}
const login_customer = (db, formDataObject) => {
    let result = false
    try {
        console.log("check if email exists into customer...");
        db.exec({
            sql: `select count(cid) from CUSTOMER WHERE email = \'${formDataObject["login_email"]}\'`,
            rowMode: 'array', // 'array' (default), 'object', or 'stmt'
            callback: function (row) {
                console.log("row ", ++this.counter, "=", row);
                if (row[0] ==1)
                    result = true;
            }.bind({ counter: 0 })
        });
    } catch (error) {
        console.log(error)
    }
    return result
}

const insert_into_customer = (db, formDataObject) => {
    var cid = "C" + Math.random().toString(16).slice(2)
    try {
        console.log("insert into customer...");
        let result = db.exec({
            sql: "insert into CUSTOMER(cid,fname,lname, email, address, phone, status) values ($a,$b, $c, $d, $e, $f, $g)",
            // bind by parameter name...
            bind: { $a: cid, $b: formDataObject["registration_fname"], $c: formDataObject["registration_lname"], $d: formDataObject["registration_email"], $e: formDataObject["registration_address"], $f: formDataObject["registration_phone"], $g: formDataObject["registration_status"]}
        });
        return result
    } catch (error) {
        console.log(error)
    }
}
const query_average_product_price = (db, begin_date, end_date) => {
    console.log("Query average_product_price");
    result = []

    db.exec({
        sql: `select ptype, sum(quantity*pricesold)/sum(quantity) from TRANSACTION_TABLE NATURAL JOIN APPEARS_IN NATURAL JOIN PRODUCT WHERE TRANSACTION_TABLE.TDATE >= \'${begin_date}\' AND TRANSACTION_TABLE.TDATE <= \'${end_date}\' AND  TRANSACTION_TABLE.TTAG != \'NOT CONFIRMED\'  GROUP BY PTYPE`,
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function (row) {
            console.log("row ", ++this.counter, "=", row);
            result += `${row[0]},${row[1]}\n`
        }.bind({ counter: 0 })
    });
    if (result == [])
        result = "N/A"
    console.log(result)
    return result
}

const query_maximum_basket = (db, begin_date, end_date) => {
    console.log("Query maximum_basket", begin_date, end_date);
    result = [] 
    inner_sql = `select bid, quantity, pricesold, sum(quantity*pricesold) from appears_in group by bid`
    db.exec({
        // sql : inner_sql,
        sql: `select ccnumber, max(total) from transaction_table natural join (select bid, sum(quantity*pricesold) AS total FROM appears_in group by bid) where ttag != 'NOT CONFIRMED' and tdate >= \'${begin_date}\' and tdate <= \'${end_date}\' group by ccnumber`,
        // sql : `select ccnumber, max(total) from transaction_table natural join ${inner_sql} where ttag != "NOT CONFIRMED" and tdate >= \'${begin_date}\' and tdate <= \'${end_date}\' group by ccnumber`,
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function (row) {
            console.log("row ", ++this.counter, "=", row);
            result += `${row[0]},${row[1]}\n`
        }.bind({ counter: 0 })
    });
    if (result == [])
        result = "N/A"
    console.log(result)
    return result
}

const query_distinct_customers = (db, begin_date, end_date) => {
    console.log("Query distinct_customers", begin_date, end_date);
    result = []
    inner_sql = `select distinct pid, cid from appears_in natural join transaction_table where ttag != 'NOT CONFIRMED' and tdate >= \'${begin_date}\' and tdate <= \'${end_date}\'`,

    db.exec({
        sql : `select pid, count(cid) from (${inner_sql}) group by pid order by count(cid) desc`,
        // sql: `select APPEARS_IN.PID, COUNT(CID), PNAME from TRANSACTION_TABLE NATURAL JOIN APPEARS_IN NATURAL JOIN PRODUCT WHERE TRANSACTION_TABLE.TDATE >= \'${begin_date}\' AND TRANSACTION_TABLE.TDATE <= \'${end_date}\' AND  TRANSACTION_TABLE.TTAG != \'NOT CONFIRMED\'  GROUP BY APPEARS_IN.PID ORDER BY COUNT(CID) DESC`,
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function (row) {
            console.log("row ", ++this.counter, "=", row);
            result += `${row[0]},${row[1]}\n`
        }.bind({ counter: 0 })
    });
    if (result == [])
        result = "N/A"
    console.log(result)
    return result
}

const query_frequent_products = (db, begin_date, end_date) => {
    console.log("Query frequent_products", begin_date,end_date);
    result = []

    db.exec({
        sql: `select APPEARS_IN.PID, SUM(QUANTITY), PNAME from TRANSACTION_TABLE NATURAL JOIN APPEARS_IN NATURAL JOIN PRODUCT WHERE TRANSACTION_TABLE.TDATE >= \'${begin_date}\' AND TRANSACTION_TABLE.TDATE <= \'${end_date}\' AND  TRANSACTION_TABLE.TTAG != \'NOT CONFIRMED\'  GROUP BY APPEARS_IN.PID ORDER BY SUM(QUANTITY) DESC`,
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function (row) {
            console.log("row ", ++this.counter, "=", row);
            result += `${row[0]},${row[1]},${row[2]}\n`
        }.bind({ counter: 0 })
    });
    if (result == [])
        result = "N/A"
    console.log(result)
    return result
}

const query_credit_card_total_amount = (db) => {
    console.log("Query credit_card_total_amount");
    result = []
    db.exec({
        sql: "select CREDIT_CARD.CCNUMBER, SUM(PRICESOLD) from CREDIT_CARD NATURAL JOIN TRANSACTION_TABLE NATURAL JOIN APPEARS_IN WHERE TRANSACTION_TABLE.TTAG != \'NOT CONFIRMED\' GROUP BY CREDIT_CARD.CCNUMBER",
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function (row) {
            console.log("row ", ++this.counter, "=", row);
            result += `${row[0]},${row[1]}\n`
        }.bind({ counter: 0 })
    });
    if (result == [])
        result = "N/A"
    console.log(result)
    return result
}

const query_best_customers = (db) => {
    console.log("Query best_customers");
    result = []
    db.exec({
        sql: "select CUSTOMER.CID, FNAME, LNAME, SUM(PRICESOLD) from CUSTOMER NATURAL JOIN TRANSACTION_TABLE NATURAL JOIN APPEARS_IN WHERE TRANSACTION_TABLE.TTAG != \'NOT CONFIRMED\' GROUP BY CUSTOMER.CID ORDER BY SUM(PRICESOLD) DESC limit 10",
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function (row) {
            console.log("row ", ++this.counter, "=", row);
            result += `${row[0]},${row[1]},${row[2]},${row[3]}\n`
        }.bind({ counter: 0 })
    });
    if (result == [])
        result = "N/A"
    console.log(result)
    return result
}



const create_table = (db) => {
    try {
        console.log("Create CUSTOMER table");
        db.exec("CREATE TABLE IF NOT EXISTS CUSTOMER(CID VARCHAR(15) NOT NULL, FNAME VARCHAR(30),LNAME VARCHAR(30), EMAIL VARCHAR(50), ADDRESS VARCHAR(50), PHONE VARCHAR(15), STATUS VARCHAR(30), PRIMARY KEY (CID), UNIQUE (EMAIL))");

        console.log("Create SILVER_AND_ABOVE table");
        db.exec("CREATE TABLE IF NOT EXISTS SILVER_AND_ABOVE(CID VARCHAR(15) NOT NULL, CREDITLINE INTEGER, PRIMARY KEY (CID), FOREIGN KEY (CID) REFERENCES EMPLOYEE (CID) ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create CREDIT_CARD table");
        db.exec("CREATE TABLE IF NOT EXISTS CREDIT_CARD(CCNUMBER VARCHAR(15) NOT NULL, SECNUMBER VARCHAR(15), OWNERNAME VARCHAR(60), CCTYPE VARCHAR(30), BILADDRESS VARCHAR(50), EXPDATE DATETIME, STOREDCARDCID VARCHAR (15) NOT NULL, PRIMARY KEY (CCNUMBER), FOREIGN KEY (STOREDCARDCID) REFERENCES CUSTOMER (CID) ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create SHIPPING_ADDRESS table")
        db.exec("CREATE TABLE IF NOT EXISTS SHIPPING_ADDRESS(CID VARCHAR(15) NOT NULL, SANAME VARCHAR(50) NOT NULL, RECIPIENTNAME VARCHAR(50), STREET VARCHAR(50), SNUMBER INTEGER, CITY VARCHAR(30), ZIP INTEGER, STATE VARCHAR(30), COUNTRY VARCHAR(30), PRIMARY KEY (CID, SANAME), FOREIGN KEY (CID) REFERENCES CUSTOMER (CID) ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create BASKET table")
        db.exec("CREATE TABLE IF NOT EXISTS BASKET(BID VARCHAR(15) NOT NULL, CID VARCHAR(15) NOT NULL, PRIMARY KEY (BID), FOREIGN KEY (CID) REFERENCES CUSTOMER (CID) ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create TRANSACTION table")
        db.exec("CREATE TABLE IF NOT EXISTS TRANSACTION_TABLE(BID VARCHAR(15) NOT NULL, CCNUMBER VARCHAR(15) NOT NULL, CID VARCHAR (15) NOT NULL, SANAME VARCHAR(50) NOT NULL, TDATE DATETIME, TTAG VARCHAR(30), PRIMARY KEY (BID, CCNUMBER, CID, SANAME), FOREIGN KEY (BID) REFERENCES BASKET (BID) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (CCNUMBER) REFERENCES CREDIT_CARD (CCNUMBER) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (CID, SANAME) REFERENCES SHIPPING_ADDRESS (CID, SANAME) ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create PRODUCT table")
        db.exec("CREATE TABLE IF NOT EXISTS PRODUCT(PID VARCHAR(15) NOT NULL, PTYPE VARCHAR (30), PNAME VARCHAR(30), PPRICE DOUBLE, DESCRIPTION VARCHAR (200), PQUANTITY INTEGER, PRIMARY KEY (PID))");

        console.log("Create APPEARS_IN table")
        db.exec("CREATE TABLE IF NOT EXISTS APPEARS_IN(BID VARCHAR(15) NOT NULL, PID VARCHAR(15) NOT NULL, QUANTITY INTEGER, PRICESOLD DOUBLE, PRIMARY KEY (BID, PID), FOREIGN KEY (BID) REFERENCES BASKET (BID) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (PID) REFERENCES PRODUCT (PID) ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create OFFER_PRODUCT table")
        db.exec("CREATE TABLE IF NOT EXISTS OFFER_PRODUCT(PID VARCHAR(15) NOT NULL, OFFERPRICE DOUBLE, PRIMARY KEY (PID), FOREIGN KEY (PID) REFERENCES PRODUCT ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create COMPUTER table")
        db.exec("CREATE TABLE IF NOT EXISTS COMPUTER(PID VARCHAR(15) NOT NULL, CPUTYPE VARCHAR(50), PRIMARY KEY (PID), FOREIGN KEY (PID) REFERENCES PRODUCT ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create PRINTER table")
        db.exec("CREATE TABLE IF NOT EXISTS PRINTER(PID VARCHAR(15) NOT NULL, PRINTERTYPE VARCHAR (50), RESOLUTION VARCHAR (50), PRIMARY KEY (PID), FOREIGN KEY (PID) REFERENCES PRODUCT ON DELETE CASCADE ON UPDATE CASCADE)");

        console.log("Create LAPTOP table")
        db.exec("CREATE TABLE IF NOT EXISTS LAPTOP(PID VARCHAR(15) NOT NULL, BTYPE VARCHAR(50), WEIGHT VARCHAR(15), PRIMARY KEY (PID), FOREIGN KEY (PID) REFERENCES PRODUCT ON DELETE CASCADE ON UPDATE CASCADE)");
    }
    catch (error) {
        console.log(error)
    }
}

const populate_data = (db) => {
    try {
        //  customers
        db.exec({
            sql: "insert into CUSTOMER(CID,FNAME,LNAME, EMAIL, ADDRESS, PHONE, STATUS) values ($a,$b, $c, $d, $e, $f, $g)",
            bind: { $a: "C001", $b: "alice", $c: "smith", $d: "alice@examples.com", $e: "123 Elm St", $f: "1234567890", $g: "regular" }
        });
        db.exec({
            sql: "insert into CUSTOMER(CID,FNAME,LNAME, EMAIL, ADDRESS, PHONE, STATUS) values ($a,$b, $c, $d, $e, $f, $g)",
            bind: { $a: "C002", $b: "bob", $c: "johnson", $d: "bob@examples.com", $e: "456 Maple Ave", $f: "2345678901", $g: "silver" }
        });
        db.exec({
            sql: "insert into CUSTOMER(CID,FNAME,LNAME, EMAIL, ADDRESS, PHONE, STATUS) values ($a,$b, $c, $d, $e, $f, $g)",
            bind: { $a: "C003", $b: "charlie", $c: "lee", $d: "charlie@examples.com", $e: "789 Oak Blvd", $f: "3456789012", $g: "gold" }
        });
        db.exec({
            sql: "insert into CUSTOMER(CID,FNAME,LNAME, EMAIL, ADDRESS, PHONE, STATUS) values ($a,$b, $c, $d, $e, $f, $g)",
            bind: { $a: "C004", $b: "dana", $c: "wong", $d: "dana@examples.com", $e: "321 Pine Ln", $f: "4567890123", $g: "platinum" }
        });
        // silver_and_above
        db.exec({
            sql: "insert into SILVER_AND_ABOVE(CID,CREDITLINE) values ($a,$b)",
            bind: { $a: "C002", $b: 2000, }
        });
        db.exec({
            sql: "insert into SILVER_AND_ABOVE(CID,CREDITLINE) values ($a,$b)",
            bind: { $a: "C003", $b: 5000, }
        });
        db.exec({
            sql: "insert into SILVER_AND_ABOVE(CID,CREDITLINE) values ($a,$b)",
            bind: { $a: "C004", $b: 10000, }
        });
        // credit card
        db.exec({
            sql: "insert into CREDIT_CARD(CCNUMBER,SECNUMBER, OWNERNAME, CCTYPE, BILADDRESS, EXPDATE, STOREDCARDCID) values ($a,$b,$c,$d,$e,$f,$g)",
            bind: { $a: "CC001", $b: "111", $c: "Alice Smith", $d: "Visa", $e: "123 Elm St", $f: "2026-07-31", $g: "C001" }
        });
        db.exec({
            sql: "insert into CREDIT_CARD(CCNUMBER,SECNUMBER, OWNERNAME, CCTYPE, BILADDRESS, EXPDATE, STOREDCARDCID) values ($a,$b,$c,$d,$e,$f,$g)",
            bind: { $a: "CC002", $b: "222", $c: "Bob Johnson", $d: "MasterCard", $e: "456 Maple Ave", $f: "2025-12-31", $g: "C002" }
        });
        db.exec({
            sql: "insert into CREDIT_CARD(CCNUMBER,SECNUMBER, OWNERNAME, CCTYPE, BILADDRESS, EXPDATE, STOREDCARDCID) values ($a,$b,$c,$d,$e,$f,$g)",
            bind: { $a: "CC003", $b: "333", $c: "Charlie Lee", $d: "Amex", $e: "789 Oak Blvd", $f: "2027-03-15", $g: "C003" }
        });
        // shipping address
        db.exec({
            sql: "insert into SHIPPING_ADDRESS(CID,SANAME, RECIPIENTNAME, STREET, SNUMBER, CITY, ZIP, STATE, COUNTRY) values ($a,$b,$c,$d,$e,$f,$g,$h,$i)",
            bind: { $a: "C001", $b: "HOME", $c: "ALICE SMITH", $d: "123 ELM ST", $e: "1", $f: "NEW YORK", $g: "45678",  $h: "NY", $i: "USA" }
        });
        db.exec({
            sql: "insert into SHIPPING_ADDRESS(CID,SANAME, RECIPIENTNAME, STREET, SNUMBER, CITY, ZIP, STATE, COUNTRY) values ($a,$b,$c,$d,$e,$f,$g,$h,$i)",
            bind: { $a: "C002", $b: "WORK", $c: "BOB JOHNSON", $d: "456 MAPLE AVE", $e: "2", $f: "LOS ANGELES", $g: "67890", $h: "CA", $i: "USA" }
        });
        db.exec({
            sql: "insert into SHIPPING_ADDRESS(CID,SANAME, RECIPIENTNAME, STREET, SNUMBER, CITY, ZIP, STATE, COUNTRY) values ($a,$b,$c,$d,$e,$f,$g,$h,$i)",
            bind: { $a: "C003", $b: "HOME", $c: "CHARLIE LEE", $d: "789 OAK BLVD", $e: "3", $f: "CHICAGO",$g: "12345", $h: "IL", $i: "USA" }
        });
        // basket
        db.exec({
            sql: "insert into BASKET(BID,CID) values ($a,$b)",
            bind: { $a: "B001", $b: "C001" }
        });
        db.exec({
            sql: "insert into BASKET(BID,CID) values ($a,$b)",
            bind: { $a: "B002", $b: "C002" }
        });
        db.exec({
            sql: "insert into BASKET(BID,CID) values ($a,$b)",
            bind: { $a: "B003", $b: "C003" }
        });
        // transaction
        db.exec({
            sql: "insert into TRANSACTION_TABLE(BID,CCNUMBER, CID, SANAME, TDATE, TTAG) values ($a,$b,$c,$d,$e,$f)",
            bind: { $a: "B001", $b: "CC001", $c: "C001", $d: "HOME", $e: "2025-05-01", $f: "CONFIRMED" }
        });
        db.exec({
            sql: "insert into TRANSACTION_TABLE(BID,CCNUMBER, CID, SANAME, TDATE, TTAG) values ($a,$b,$c,$d,$e,$f)",
            bind: { $a: "B002", $b: "CC002", $c: "C002", $d: "WORK", $e: "2025-05-02", $f: "NOT DELIVERED" }
        });
        db.exec({
            sql: "insert into TRANSACTION_TABLE(BID,CCNUMBER, CID, SANAME, TDATE, TTAG) values ($a,$b,$c,$d,$e,$f)",
            bind: { $a: "B003", $b: "CC003", $c: "C003", $d: "HOME", $e: "2025-05-03", $f: "DELIVERED" }
        });
        // product
        db.exec({
            sql: "insert into PRODUCT(PID,PTYPE, PNAME, PPRICE, DESCRIPTION, PQUANTITY) values ($a,$b,$c,$d,$e,$f)",
            bind: { $a: "P001", $b: "COMPUTER", $c: "GAMING PC", $d: 1500.00, $e: "HIGH-END GAMING DESKTOP", $f: 10 }
        });
        db.exec({
            sql: "insert into PRODUCT(PID,PTYPE, PNAME, PPRICE, DESCRIPTION, PQUANTITY) values ($a,$b,$c,$d,$e,$f)",
            bind: { $a: "P002", $b: "PRINTER", $c: "HP LASER JET", $d: 200.00, $e: "FAST LASER PRINTER", $f: 20 }
        });
        db.exec({
            sql: "insert into PRODUCT(PID,PTYPE, PNAME, PPRICE, DESCRIPTION, PQUANTITY) values ($a,$b,$c,$d,$e,$f)",
            bind: { $a: "P003", $b: "LAPTOP", $c: "MACBOOK AIR", $d: 1200.00, $e: "LIGHTWEIGHT APPLE LAPTOP", $f: 15 }
        });
        // appears_in
        db.exec({
            sql: "insert into APPEARS_IN(BID,PID, QUANTITY, PRICESOLD) values ($a,$b,$c,$d)",
            bind: { $a: "B001", $b: "P001", $c: 1, $d: 1450.00 }
        });
        db.exec({
            sql: "insert into APPEARS_IN(BID,PID, QUANTITY, PRICESOLD) values ($a,$b,$c,$d)",
            bind: { $a: "B002", $b: "P002", $c: 2, $d: 190.00 }
        });
        db.exec({
            sql: "insert into APPEARS_IN(BID,PID, QUANTITY, PRICESOLD) values ($a,$b,$c,$d)",
            bind: { $a: "B001", $b: "P003", $c: 1, $d: 1150.00 }
        });
        // offer_product
        db.exec({
            sql: "insert into OFFER_PRODUCT(PID,OFFERPRICE) values ($a,$b)",
            bind: { $a: "P001", $b: 1400.00 }
        });
        db.exec({
            sql: "insert into OFFER_PRODUCT(PID,OFFERPRICE) values ($a,$b)",
            bind: { $a: "P002", $b: 180.00 }
        });
        // computer
        db.exec({
            sql: "insert into COMPUTER(PID,CPUTYPE) values ($a,$b)",
            bind: { $a: "P001", $b: "Intel i9" }
        });
        // printer
        db.exec({
            sql: "insert into PRINTER(PID,PRINTERTYPE, RESOLUTION) values ($a,$b, $c)",
            bind: { $a: "P002", $b: "Laser", $c: "1200x1200" }
        });
        // laptop
        db.exec({
            sql: "insert into LAPTOP(PID,BTYPE, WEIGHT) values ($a,$b, $c)",
            bind: { $a: "P003", $b: "Ultrabook", $c: "1.25 kg" }
        });
        console.log("populated tables")
    } catch (error) {
        console.log(error)
    }
}

