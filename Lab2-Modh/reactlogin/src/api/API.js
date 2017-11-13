const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const doLogin = (payload) => {
    return fetch(`${api}/login`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res => {
            //alert(JSON.stringify(res));
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};
export const doSignup = (payload) => {
    return fetch(`${api}/doSignUp`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    ).then(res => res.json())
        .then(res => {
            alert("in api response : "+JSON.stringify(res));
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};

export const doUpload = (payload) => {
    return fetch(`${api}/file`, {
        method: 'POST',
        headers: {
            'userid': payload.get('userid')
        },
        body: payload,
        credentials: 'include'
    }).then(res => res.json())
        .then(res => {
            //alert("do upload " + res);
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};
export const doMakedirectory = (payload) => {

    return fetch(`${api}/makeDirectory`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
    }).then(res => res.json())
        .then(res => {
            console.log("makedirectory res " + JSON.stringify(res));
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};
export const deleteDirectory = (payload) => {
    return fetch(`${api}/deleteDirectory`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
    }).then(res => {
        console.log("In delete dir api " + JSON.stringify(res));
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

};

export const doDownload = (payload) => {
    return fetch(`${api}/download`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        responseType: 'stream'
    })
        .then(res => res.json())
        .then(res => {
            alert("in download api : "+ JSON.stringify(res));
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};

export const dohandleProfile = (payload) => {
    return fetch(`${api}/profile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res => {
            alert(JSON.stringify(res));
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};

export const getProfile = (payload) => {
    return fetch(`${api}/getProfile`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res => {
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};

export const doStarFiles = (payload) =>
    fetch(`${api}/doStar`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{

            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doUnStarFiles = (payload) =>
    fetch(`${api}/doUnStar`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getStarredFiles = (payload) =>
    fetch(`${api}/getStarredFiles`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
           // alert("response from api");
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doShareFiles =(payload)=>
    fetch(`${api}/getSharedFiles`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            alert("response from api in sharefiles" +JSON.stringify(res));
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const dohandleUserActivity = (payload) => {
    return fetch(`${api}/getUserActivity`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    ).then(res => res.json())
        .then(res => {
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
};
export const logout = () =>
    fetch(`${api}/logout`, {
        method: 'POST',
        headers: {
            ...headers
        },
        credentials:'include'
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getDirectories =(payload) =>

    fetch(`${api}/getDirectories`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json())
        .then(res =>{
            debugger;
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

