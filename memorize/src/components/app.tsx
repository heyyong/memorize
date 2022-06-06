import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import { default as MemorizeEnen } from '../routes/MemorizeEnen';
import { default as NotFound } from '../routes/NotFound';
import Header from './header';

const App: FunctionalComponent = () => {
    return (
        <div id="preact_root">
            <Header progress={50} />
            <Router>
                <Route path="/" component={MemorizeEnen} />
                {/* <NotFound /> */}
            </Router>
        </div>
    );
};

export default App;
