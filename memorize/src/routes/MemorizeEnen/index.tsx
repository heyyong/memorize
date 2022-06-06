import { Component, h } from 'preact';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import { default as Enen } from '../../components/Enen';
import { api } from '../../api';
import { MarkWordRequest_MemorizedStatus, Word } from '../../api/memorize';
import style from './style.css';

interface IMemorizeEnenState {
    planId: number;
    voc: Word | null;
    progress: undefined | number;
}

export default class MemorizeEnen extends Component<{}, IMemorizeEnenState> {
    public state: IMemorizeEnenState = {
        planId: 0,
        voc: null,
        progress: undefined,
    }

    public genMemorizePlan = async () => {
        const response = await api.genNewMemorizePlan({ count: 100 });
        this.setState({ planId: response.planId });
    }

    public componentDidMount() {
        this.genMemorizePlan()
    }

    public nextWord = async () => {
        const response = await api.getNextWord({ planId: this.state.planId, spell: this.state.voc?.voc });
        const { offset, total } = response;
        this.setState({ voc: response.word || null, progress: Math.floor((offset! / total!) * 100) });
    }

    public onVocApprove = async (spell: string) => {
        await api.markWord({ planId: this.state.planId, word: spell, status: MarkWordRequest_MemorizedStatus.Approvad });
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
                <Button onClick={this.onStart}>Start Memorizing</Button>
            );
        }

        return (
            <div class={style.memorize_enen}>
                {content}
            </div>
        )
    }
}