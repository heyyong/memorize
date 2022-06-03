import { Component, h } from 'preact';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import style from './enen.css';
import { Voc } from '../voc';

import { H1 } from '../h1';
import { H5 } from '../h5';


interface IEnenProps {
    offset: number;
    voc: Voc;

    total: number;
    remain: number;

    onApprove?: (spell: string) => void;
    onReject?: (spell: string) => void;
    onNext?: (offset: number) => void;
}

interface IEnenState {
    showVoc: boolean;
}

export default class Enen extends Component<IEnenProps, IEnenState> {
    public state: IEnenState = {
        showVoc: false,
    };

    private _renderVoc() {
        return (
            <div>
                <H5>NOUN</H5>
                <ol class={style.enen_meaning}>
                    <li class={style.enen_meaning_item}>
                        <div class={style.enen_meaning_item_content}>the body of words used in a particular language.</div>
                        <ul class={style.enen_example}>
                            <li class={style.enen_example_item}>"a comparison of the vocabularies of different languages" ·</li>
                        </ul>
                    </li>
                </ol>
                <H5>NOUN</H5>
                <ol class={style.enen_meaning}>
                    <li class={style.enen_meaning_item}>
                        <div class={style.enen_meaning_item_content}>the body of words used in a particular language.</div>
                        <ul class={style.enen_example}>
                            <li class={style.enen_example_item}>"a comparison of the vocabularies of different languages" ·</li>
                        </ul>
                    </li>
                </ol>
                <div class={style.enen_next}>
                    <Button>Next</Button>
                </div>
            </div>
        )
    }

    public _renderOpetion() {
        return (
            <Stack spacing={2} direction="row" className={style.enen_feedback}>
                <Button
                    variant="text"
                    color="error"
                    onClick={this.markAsReject}
                    startIcon={<ClearIcon color="error" />}>Reject</Button>
                <Button
                    variant="text"
                    onClick={this.markAsApprove}
                    startIcon={<DoneIcon color="primary" />}>Approve</Button>
            </Stack>
        )
    }

    public render() {
        return (
            <div class={style.enen}>
                <H1>{this.props.voc.voc}</H1>
                <div class={style.enen_phonetic}>[{this.props.voc.pron.phonetic}] <VolumeUpIcon className={style.enen_phonetic_button} /></div>
                {this.state.showVoc && this._renderVoc()}
                {!this.state.showVoc && this._renderOpetion()}
            </div>
        )
    }

    public markAsApprove = () => {
        this.setState({ showVoc: true });
        this.props.onApprove?.(this.props.offset);
    }

    public markAsReject = () => {
        this.setState({ showVoc: true });
        this.props.onReject?.(this.props.offset);
    }
}
