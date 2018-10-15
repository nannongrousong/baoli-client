import React, { Component } from 'react';
import styles from 'APP_STYLES/issue.less';
import ResTable from './resTable';

class Issue extends Component {
    render() {
        return (
            <div className={styles.content}>
                <ResTable />
            </div>
        );
    }
}

export default Issue;