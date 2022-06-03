import { Component, h } from 'preact';

import { default as Enen } from '../../components/Enen';

export default class MemorizeEnen extends Component {
    public render() {
        return (
            <div>
                <Enen
                    voc={{
                        voc: 'vocabulary',
                        cla: 'cet4',
                        pron: {
                            audio: 'https://audio.oxforddictionaries.com/en/mp3/nearby_us_2_rr.mp3',
                            phonetic: 'ˌnɪrˈbaɪ'
                        }
                    }}
                    remain={50}
                    total={100}
                    onApprove={() => { }}
                    onReject={() => { }}
                ></Enen>
            </div>
        )
    }
}