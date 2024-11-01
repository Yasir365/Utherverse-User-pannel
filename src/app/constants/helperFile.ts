import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);
import globalVariables from "./global";


const helpers = {


    webcall: function () {
        // console.log('ab check kro')
    },

    checkweb: function () {
        // console.log('web3 in the house baby ', web3);
    },

    getNetworkId: async function () {
        web3.eth.getChainId().then(id => {
            // console.log('ye chain id ha lala g', id);
        })
        let chaidId = await web3.eth.getChainId();
        let id = await chaidId;
        return id;
    },

    getContractBalance: async function (contractAddress: any, abi: any, wallet: any) {
        // console.log('ye mery assets hen', contractAddress, abi, wallet)
        let balanceValue;

        let contract = new web3.eth.Contract(abi, contractAddress);
        // console.log('ye contract ha =========>', contract);

        balanceValue = await contract.methods.balanceOf(wallet).call().then((balance: any) => {
            // console.log('balance ==========>', web3.utils.fromWei(balance))
            console.log('balance ====>', web3.utils.fromWei(balance))
            return web3.utils.fromWei(balance, 'wei')
        }).catch((err: any) => {
            // console.log("BC",err.message);
        })

        return balanceValue;
    },

    titleCase: function (str: any) {
        if (str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i]?.charAt(0)?.toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            return splitStr.join(' ');
        }
    },

    getBalance: function (acct: any) {
        web3.eth.getBalance(acct).then((balance) => {
            // console.log(web3.utils.fromWei(balance));
        });
        return acct;
    },

    fromWei: function (value: any) {
        return web3.utils.fromWei(value);
    },
    toWei: function (value: any) {
        return web3.utils.toWei(value);
    },

}


export default helpers;