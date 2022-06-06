import { Component, h } from 'preact';
import Button from '@mui/material/Button';

import { default as Enen } from '../../components/Enen';
import { api } from '../../api';
import { MarkWordRequest_MemorizedStatus, Word } from '../../api/memorize';
import style from './style.css';

interface IMemorizeEnenState {
    planId: number;
    voc: Word | null;
}

export default class MemorizeEnen extends Component<{ from: number, to: number }, IMemorizeEnenState> {
    public state: IMemorizeEnenState = {
        planId: 0,
        voc: null,
    }

    public genMemorizePlan = async () => {
        const response = await api.genNewMemorizePlan({ from: 0, to: 100, })
        this.setState({ planId: response.planId });
    }

    public componentDidMount() {
        this.genMemorizePlan()
    }

    public nextWord = async () => {
        const response = await api.getNextWord({ planId: this.state.planId, spell: this.state.voc?.voc });
        this.setState({ voc: response.word || null });
        console.log(this.state, response);
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
                <Enen
                    voc={this.state.voc}
                    onNext={this.nextWord}
                    onApprove={this.onVocApprove}
                    onReject={this.onVocRejected}
                ></Enen>
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