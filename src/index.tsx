import * as React from 'react';
import NewCom from './components/new';
import './style/index';

interface MabyLibProps {
  sendMsg: string;
}

class MabyLibCli extends React.Component<MabyLibProps, {}> {
  public state = {
    value: 'maby-lib-cli',
  };
  public render() {
    const { value } = this.state;
    const { sendMsg } = this.props;
    return (
      <div>
        <div>{value}</div>
        <i>{sendMsg}</i>
        <NewCom />
      </div>
    );
  }
}
export default MabyLibCli;
