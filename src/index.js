import React from 'react';
import ReactDOM from 'react-dom';
import Terminal from 'react-bash';
import sha256 from 'sha256';
import { validateMnemonic, mnemonicToSeedSync, generateMnemonic, mnemonicToEntropy } from 'bip39';
import ipfs from 'ipfs';
import qs from 'query-string';

const bip39 = { validateMnemonic, mnemonicToSeedSync, generateMnemonic, mnemonicToEntropy };

const web3Commands = ['- hash', '- bip39', '- ipfs'];

var ipfs_node;

class Web3terminal extends Terminal {

    componentDidMount ( props ) {

        const _this = this;
        const _log = console.log;

        setIframeFormat();

        return (
            console.log = function () {
                _this.addToHistory(arguments);
                return _log.apply(console, arguments);
            }
        );

        function setIframeFormat () {
            var iframe = qs.parse(window.location.search, { ignoreQueryPrefix: true }).iframe;
            console.log('iframe', iframe)
            if ( iframe === 'true' ) {
                document.getElementById('app').className = "iframe";
                document.getElementById('app').children[0].children[0].className = "hidden"; 
            } 
        }

    }

    addToHistory ( args ) {

        this.setState({
                history: this.state.history.concat(
                    { value: args },
                ),
            })

    }  

}


const extensions = {
    sudo: {
        exec: ({ structure, history, cwd }) => {
            return { structure, cwd,
                history: history.concat({ value: 'Nice try... (ಠ(ಠ(ಠ_ಠ)ಠ)ಠ)' }),
            };
        },
    },
    docs : {
    	exec: (state) => {
	        return Object.assign({}, state, {
	            history: state.history.concat(
	                { value: 'Web3-Terminal:' },
	                { value: 'These commands can be used for web3 functionality. Type \'docs\' to see this list.' },
	                ...web3Commands.map(value => ({ value }))
	            ),
	        });
	    },
    },
    hash : {
        exec: (state, { flags, args }) => {

            var response = "";

            if ( args[0] ) {
                response = sha256(args[0]);
            } else {
                response = "Please pass a string after the hash command. i.e. 'hash myTestString'";
            }

            return Object.assign({}, state, {
                history: state.history.concat(
                    { value: response }
                ),
            });
        },
    },
    bip39 : {
        exec: (state, { flags, args }) => {

            var response = "";
            console.log('args', args)
            var mnemonic = concatArgsToString( args );
            console.log('mnemonic', mnemonic)

            if ( Object.keys(args).length > 0 ) {
            	if ( args['generateMnemonic'] === 'true' ) {
            		response = bip39.generateMnemonic();
            	} else if ( args['mnemonicToEntropy'] ) {
            		response = "Mnemonic Entropy: " + bip39.mnemonicToEntropy( mnemonic );
            	} else if ( args['validateMnemonic'] ) {
            		response = "Mnemonic Valid: " + bip39.validateMnemonic( mnemonic );
            	}
            } else {
		        return Object.assign({}, state, {
		            history: state.history.concat(
		                { value: 'bip39:' },
		                { value: 'This command can be used to generate HD wallets:' },
		                { value: 'Pass `--generateMnemonic true` to create a new BIP39 mnemonic ' },
		                { value: 'Pass `your mnemonic string of words separated by spaces --validateMnemonic true` to validate a mnemonic' },
		                { value: 'Pass `your mnemonic string of words separated by spaces --mnemonicToEntropy true` to calculate the entropy of a known mnemonic' },
		            ),
		        });
            }

            console.log('response is ', response);

            return Object.assign({}, state, {
                history: state.history.concat(
                    { value: response }
                ),
            });
        },
    },
    ipfs : {
        exec: (state, { flags, args }) => {

            if ( Object.keys(args).length > 0 ) {

                if ( args[0] === 'start' ) {
                   if ( typeof(ipfs_node) === "undefined" || ipfs_node === null ) {
                        startIpfs(function(ipfs_node) {

                       });
                   } else {
                     return Object.assign({}, state, {
                                history: state.history.concat(
                                    { value: "IPFS Node already running." }
                                ),
                            }); 
                   }
                   

                } else if ( args[0] === 'stop' ) {

                    ipfs_node.stop();
                    ipfs_node = null;

                    return Object.assign({}, state, {
                        history: state.history.concat(
                            { value: "IPFS Node shutting down..." }
                        ),
                    }); 

                } else {
                    
                }
                
            } else {
                return Object.assign({}, state, {
                    history: state.history.concat(
                        { value: 'ipfs:' },
                        { value: 'The Interplanetary File System allows users to share files peer-to-peer:' },
                        { value: 'Try `ipfs start` to run a node.' },
                    ),
                });
            }

            async function startIpfs (cb) {
                Object.assign({}, state, {
                                history: state.history.concat(
                                    { value: "IPFS Node starting..." }
                                ),
                            }); 
                ipfs_node = await ipfs.create()

                cb(ipfs_node)
                
            }


        }
    }
};

function concatArgsToString ( args ) {
	var str = "";
	var i = 0;

	do {

		str += args[i] + " ";
		i++;

	} while ( typeof(args[i]) != "undefined" );

	return str;

}

function concatArgsToArray ( args ) {
	var arr = [];
	var i = 0;

	do {

		arr.push(args[i]);
		i++;

	} while ( typeof(args[i]) != "undefined" );

	return arr;

}

const history = [
    { value: 'Welcome to our Web3 Terminal' },
    { value: 'Try out your commands here safely and become an expert in no time.' },
    { value: 'Powered by The Blockchain Institute - Visit https://weteachblockchain.org/ for more great tools!' },
    { value: 'Type `help` for general tips or `docs` for web3 specific options.' },
];

const structure = {
    '.hidden': {
        file1: { content: 'The is the content for file1 in the <.hidden> directory.' },
        file2: { content: 'The is the content for file2 in the <.hidden> directory.' },
        dir2: {
            file: { content: 'The is the content for <file> in the <.hidden> directory.' },
        },
        '.secrets': { content: 'I\'m still afraid of the dark...' },
    },
    public: {
        file1: { content: 'The is the content for file1 in the <public> directory.' },
        file2: { content: 'The is the content for file2 in the <public> directory.' },
        file3: { content: 'The is the content for file3 in the <public> directory.' },
    },
    'README.md': { content: '✌⊂(✰‿✰)つ✌ Thanks for checking out the tool! There is a lot that you can do with react-bash and I\'m excited to see all of the fun commands and projects build on top of it!' },
};


const Root = <Web3terminal history={history} structure={structure} extensions={extensions} />;
ReactDOM.render(Root, document.getElementById('app'));