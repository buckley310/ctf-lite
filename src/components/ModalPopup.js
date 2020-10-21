import React from 'react';
import styles from './ModalPopup.module.css';

export default class ModalPopup extends React.Component {
    render() {
        return (
            <div
                onClick={this.props.close}
                className={styles.modalRoot}
                style={{ display: this.props.show ? '' : 'none' }}
            >
                <div className={styles.modalPopup} onClick={e => e.stopPropagation()}>
                    <span className={styles.closeButton} onClick={this.props.close}>&times;</span>
                    <div style={{ fontSize: '1.5em', fontWeight: "bold" }}>{this.props.title}</div><br />
                    {this.props.children}
                </div>
            </div>
        );
    }
}