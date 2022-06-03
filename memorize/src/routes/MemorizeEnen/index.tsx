import { Component, h } from 'preact';
import CircularProgress from '@mui/material/CircularProgress';

import { default as Enen } from '../../components/Enen';
import { Voc } from '../../components/voc';
import style from './style.css';

interface IMemorizeEnenState {
    total: number;

    vocList: Voc[];

    offset: number;

    done: boolean;
}

export default class MemorizeEnen extends Component<{ from: number, to: number }, IMemorizeEnenState> {
    public state: IMemorizeEnenState = {
        total: 100,
        offset: 0,

        vocList: [],

        done: false,
    }

    public componentDidMount() {
        this.getWords(this.props.from, this.props.to);
    }

    public async getWords(from: number, to: number): Promise<void> {
        let total: number = to - from

        const vocList: Voc[] = [];

        this.setState({ total, vocList });
    }

    public randList: number[] = [];
    public vocMemorized: Record<string, number> = {};

    public getNextVoc(offset: number = 0): Voc | null {
        let voc: Voc | null = null;
        while (voc === null && offset < this.state.total) {
            const index = this.randList[offset];
            voc = this.state.vocList[index];
            const count = this.vocMemorized[voc.voc];

            if (!count) {
                throw new Error(`Unknown count ${voc.voc}`);
            }

            if (count >= 3) {
                offset++;
                continue;
            }

            break;
        }
        this.setState({ offset });

        return voc;
    }

    public getRandom(count: number) {
        const rand: number[] = [];
        for (let i = 0; i < count; i++) {
            rand.push(i);
        }

        rand.sort((a, b) => Math.random() - 0.5);

        this.randList = rand;
    }

    public getVoc = () => {
        const index = this.randList[this.state.offset];

        const voc = this.state.vocList[index];

        return voc;
    }

    public onVocApprove = (spell: string) => {
        if (!(spell in this.vocMemorized)) throw new Error('Unknown spell');

        this.vocMemorized[spell]++;
    }


    public onVocRejected = (spell: string) => {
        if (!(spell in this.vocMemorized)) throw new Error('Unknown spell');

        this.vocMemorized[spell] = 0;
    }

    public onNext = (offset: number) => {
        const voc = this.getNextVoc(offset + 1);
        if (!voc) {
            this.setState({ done: true })
        }
    }

    public render() {
        let content: JSX.Element | null = null;
        if (this.state.done) {
            content = <div>Done!</div>
        } else if (this.getVoc()) {
            content = (
                <Enen
                    voc={this.getVoc()}
                    remain={this.state.total - this.state.offset}
                    total={this.state.total}
                    onApprove={this.onVocApprove}
                    onReject={this.onVocRejected}
                ></Enen>
            );
        } else {
            content = <CircularProgress color="inherit" />
        }

        return (
            <div class={style.memorize_enen}>
                {content}
            </div>
        )
    }
}