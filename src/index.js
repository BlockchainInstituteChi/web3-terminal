import React from 'react';
import ReactDOM from 'react-dom';
import Terminal from 'react-bash';
import sha256 from 'sha256';

const web3Commands = ['hash'];


const extensions = {
    sudo: {
        exec: ({ structure, history, cwd }) => {
            return { structure, cwd,
                history: history.concat({ value: 'Nice try... (ಠ(ಠ(ಠ_ಠ)ಠ)ಠ)' }),
            };
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
};

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

const Root = <Terminal history={history} structure={structure} extensions={extensions} />;
ReactDOM.render(Root, document.getElementById('app'));
