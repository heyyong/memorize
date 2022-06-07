import { Component, createRef, h } from 'preact';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import style from './enen.css';
import { Word } from '../../api/memorize';

import { H1 } from '../h1';
import { H5 } from '../h5';


interface IEnenProps {
    voc: Word;

    onApprove?: (spell: string) => Promise<void>;
    onReject?: (spell: string) => Promise<void>;
    onNext?: (spell: string) => Promise<void>;
}

interface IEnenState {
    marked: boolean;
}

export default class Enen extends Component<IEnenProps, IEnenState> {
    public state: IEnenState = {
        marked: false,
    };

    private _renderVoc() {
        return (
            <div>
                {
                    this.props.voc.properties.map((property) => {
                        return (
                            <div>
                                <H5>{property.prop}</H5>
                                <ol class={style.enen_meaning}>
                                    {
                                        property.meanings.map((mean) => {
                                            return (<li class={style.enen_meaning_item}>
                                                <div class={style.enen_meaning_item_content}>{mean.content}</div>
                                                <ul class={style.enen_example}>
                                                    {
                                                        mean.examples.map(e => {
                                                            return (
                                                                <li class={style.enen_example_item}>{`"${e.example}"`}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </li>)
                                        })
                                    }
                                </ol>
                            </div>
                        );
                    })
                }
                <div class={style.enen_next}>
                    <Button onClick={() => {
                        this.setState({ marked: false }, () => {
                            this.props.onNext?.(this.props.voc.voc);
                        });
                    }}>Next</Button>
                </div>
            </div>
        )
    }

    public _renderOpetion() {
        return (
            //@ts-ignore
            <Stack spacing={2} direction="row" className={style.enen_feedback}>
                <Button
                    variant="text"
                    color="error"
                    onClick={async () => this.props.onReject?.(this.props.voc.voc).then(() => this.setState({ marked: true }))}
                    // @ts-ignore
                    startIcon={<ClearIcon color="error" />}>Reject</Button>
                <Button
                    variant="text"
                    onClick={async () => this.props.onApprove?.(this.props.voc.voc).then(() => this.setState({ marked: true }))}
                    // @ts-ignore
                    startIcon={<DoneIcon color="primary" />}>Approve</Button>
            </Stack>
        )
    }

    public render() {
        const { marked } = this.state;

        return (
            <div class={style.enen}>
                <H1>{this.props.voc.voc}</H1>
                <Phonetic
                    audio={this.props.voc!.pron!.audio}
                    phonetic={this.props.voc.pron!.phonetic}
                    playWhenMounted
                />
                {marked ? this._renderVoc() : this._renderOpetion()}
            </div>
        )
    }
}

interface IPhoneticProps {
    audio: string;
    phonetic: string;
    playWhenMounted: boolean;
}

class Phonetic extends Component<IPhoneticProps> {
    public ref = createRef();

    public play = () => {
        this.ref.current!.play();
    }

    public componentWillReceiveProps(nextProps: IPhoneticProps) {
        if (this.props.playWhenMounted && this.props.audio !== nextProps.audio) {
            window.setTimeout(() => {
                this.play();
            }, 500)
        }
    }

    public componentDidMount() {
        if (this.props.playWhenMounted) {
            window.setTimeout(() => {
                this.play();
            }, 500)
        }
    }

    public render() {
        return (
            <div class={style.enen_phonetic}>
                [{this.props.phonetic}] <VolumeUpIcon onClick={this.play} className={style.enen_phonetic_button} />
                <div style="display: hidden"><audio ref={this.ref} src={this.props.audio}></audio></div>
            </div>
        );
    }
}
