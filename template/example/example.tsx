import * as React from 'react';

import MabyLibCli from '../src/index';

export default class Example extends React.Component {
  public render() {
    return (
      <div>
        <h2>maby-lib-cli</h2>
        <MabyLibCli sendMsg='hello lib!' />
      </div>
    );
  }
}
