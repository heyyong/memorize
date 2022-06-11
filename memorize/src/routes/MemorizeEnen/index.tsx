import { Component, h } from 'preact';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

import { default as Enen } from '../../components/Enen';
import { api } from '../../api';
import { MarkWordRequest_MemorizedStatus, Word } from '../../api/memorize';
import style from './style.css';

interface IMemorizeEnenState {
    planId: number;
    voc: Word | null;
    progress: undefined | number;

    claList: string[];
    words: string;
    syncs: string;
}

export default class MemorizeEnen extends Component<{}, IMemorizeEnenState> {
    public state: IMemorizeEnenState = {
        planId: 0,
        voc: null,
        progress: undefined,

        claList: [],
        words: '',
        syncs: ''
    }

    public genMemorizePlan = async () => {
        const response = await api.genNewMemorizePlan({ count: 50 });
        this.setState({ planId: response.planId });
    }

    public getClaList = async (): Promise<void> => {
        const response = await api.getClaList({});

        this.setState({ claList: response.cla });
    }

    public componentDidMount() {
        this.genMemorizePlan()
        this.getClaList()
    }

    public nextWord = async () => {
        const response = await api.getNextWord({ planId: this.state.planId, spell: this.state.voc?.voc });
        const { offset, total } = response;
        this.setState({ voc: response.word || null, progress: Math.floor((offset! / total!) * 100) });
        if (!response.word) {
            this.setState({ planId: 0 });
        }
    }

    public onVocApprove = async (spell: string) => {
        await api.markWord({ planId: this.state.planId, word: spell, status: MarkWordRequest_MemorizedStatus.Approvad });
    }

    public triggerSync = async (cla?: string, words?: string[]) => {
        await api.triggerWordSync({ cla, words });
    }


    public onVocRejected = async (spell: string) => {
        await api.markWord({ planId: this.state.planId, word: spell, status: MarkWordRequest_MemorizedStatus.Rejected });
    }

    public onStart = async () => {
        if (!this.state.planId) {
            await this.genMemorizePlan();
        }

        if (!this.state.voc) {
            await this.nextWord();
        }
    }

    public render() {
        let content: JSX.Element | null = null;
        if (this.state.voc && this.state.planId) {
            content = (
                <div>
                    {this.state.progress && <LinearProgress color="secondary" variant='determinate' value={this.state.progress} />}
                    <Enen
                        voc={this.state.voc}
                        onNext={this.nextWord}
                        onApprove={this.onVocApprove}
                        onReject={this.onVocRejected}
                    ></Enen>
                </div>
            )
        } else {
            content = (
                <div>
                    <div>
                        <Button onClick={this.onStart}>Start Memorizing</Button>
                    </div>
                    <hr />
                    <div>
                        Sync
                        <div>
                            {this.renderSyncWords()}
                        </div>
                        <ul>
                            {this.renderSync()}
                        </ul>
                    </div>
                    <hr />
                    <div>
                        Upload
                        {this.renderUpload()}
                    </div>
                </div>
            );
        }

        return (
            <div class={style.memorize_enen}>
                {content}
            </div>
        )
    }

    public renderUpload = () => {
        return (
            <div>
                <Button onClick={this.uploadWords}>Upload</Button>
                <div>
                    <TextField
                        label="Upload"
                        multiline
                        maxRows={10000}
                        value={this.state.words}
                        onChange={this.onWordChanges}
                        variant="standard"
                    />
                </div>
            </div>
        )
    }

    public uploadWords = async () => {
        const words = this.state.words;
        if (!words) {
            console.error('no words');
            return;
        }
        const lines = words.split(/\n+/);
        let cla = lines[0];
        if (!/^cla:[\w\d]+$/.test(cla)) {
            console.error('wrong cla');
            return;
        }
        cla = cla.slice(4).trim();


        const uploads: { voc: string, cla: string }[] = [];
        for (const line of lines.slice(1)) {
            if (!line.trim()) continue;
            // if (!/^[\w'\-\[\]]+$/.test(line)) {
            //     console.error(`check ${line}`);
            //     return;
            // }

            const word = line.trim();
            uploads.push({
                voc: word,
                cla: cla,
            });
        }

        await api.uploadWordCollection({ vocList: uploads });
    }

    public onWordChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ words: e.target.value });
    }

    public renderSync = () => {
        return this.state.claList.map(cla => {
            return <li><Button onClick={() => this.triggerSync(cla)}>{cla}</Button></li>
        });
    }

    public renderSyncWords = () => {
        return (
            <div>
                <TextField
                    label="sync"
                    multiline
                    maxRows={10000}
                    value={this.state.syncs}
                    onChange={(e) => this.setState({ syncs: e.target.value })}
                    variant="standard"
                />
                <div>
                    <Button onClick={this.syncWords}>Trigger</Button>
                </div>
            </div>
        )
    }

    public syncWords = async () => {
        const { syncs } = this.state;
        let words: string[] | undefined = undefined;
        if (syncs.trim() !== '') {
            words = syncs
                .split(/\n/)
                .map(w => w.trim())
                .filter(w => Boolean(w))
        }
        this.triggerSync(undefined, words);
    }
}