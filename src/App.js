import React from 'react';
import numeral from 'numeral';
import cx from 'classnames';
import styles from './bootstrap.min.module.css';

class RegCFLimitApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salary: '',
            netWorth: '',
            yourLimit: '',
            isAccredited: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        const amount = event.target.value;

        if (!amount || amount.match(/^\d{1,}?$/)) {
            this.setState({
                [event.target.name]: event.target.value
            });
        };
    }
    handleSubmit(event) {
        event.preventDefault();

        let invNW = +this.state.netWorth;
        let invSalary = +this.state.salary;
        let invLimit = 0;

        //Check and display Accredited Investor status
        if (invNW >= 1000000 || invSalary >= 200000) {
            this.setState(() => ({ isAccredited: true }));
        } else {
            this.setState(() => ({ isAccredited: false }));
        };

        const secLimit = 124000; //Used in the limit calculations - may change each year

        //Calculate Reg CF 12-month Limit
        if (invNW >= secLimit && invSalary >= secLimit) {
            invLimit = Math.max(.1 * invNW, .1 * invSalary);

        } else {
            invLimit = Math.max(
                2500,
                Math.max(.05 * invNW, .05 * invSalary)
            );
        }

        this.setState(() => {
            return {
                yourLimit: invLimit
            };
        });

        //Error Check
        if (!this.state.netWorth || !this.state.salary) {
            //Return error state
            this.setState(() => {
                return {
                    error: true
                };
            });
        } else {
            this.setState(() => {
                return {
                    error: ''
                };
            });
        };
    }
    render() {
        return (
            <div align='center' style={{ width: '100%' }} >
                {this.state.error && <div className={cx(styles.alert, styles['alert-danger'])}>Please enter your Annual Income and Net Worth. </div>}
                <form className={styles.form} style={{ width: '70%', maxWidth: '500px' }} horizontal id="cf-limit-calculator" onSubmit={this.handleSubmit} autoComplete="off" >
                    <div className={styles['form-group']}>
                        <div className={styles.container}>
                            <div className={styles.row}>
                                <div className={cx(styles.col, styles['col-sm-4'])}>Annual Income:</div>
                                <div className={styles.col}>
                                    <div className={styles['input-group']}>
                                        <span className={styles['input-group-text']}>$</span>
                                        <input className={styles['form-control']}
                                            type="text"
                                            name="salary"
                                            placeholder="Income e.g. 60,000"
                                            autoFocus
                                            value={this.state.salary}
                                            onChange={this.handleChange}
                                        />
                                        <span className={styles['input-group-text']}>.00</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={cx(styles.col, styles['col-sm-4'])}>Net Worth:</div>
                                <div className={styles.col}>
                                    <div className={styles['input-group']}>
                                        <span className={styles['input-group-text']}>$</span>
                                        <input className={styles['form-control']}
                                            type="text"
                                            name="netWorth"
                                            placeholder="Net Worth - e.g. 100,000"
                                            value={this.state.netWorth}
                                            onChange={this.handleChange}
                                        />
                                        <span className={styles['input-group-text']}>.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <button className={cx(styles.btn, styles['btn-primary'])} type="submit">Calculate Your Limit</button>
                    </div>
                </form>
                <br />
                {(!this.state.error && this.state.yourLimit) ? (<div className={cx(styles.alert, styles['alert-primary'])} style={{ width: '90%', maxWidth: '500px' }} >Your 12-month Reg CF investment limit is: <br /><strong> {numeral(this.state.yourLimit).format('$0,0.00')} </strong> </div>) : 'Enter values above and click "Calculate Limit"'}
                {this.state.isAccredited ? <div className={cx(styles.alert, styles['alert-info'])} style={{ width: '90%', maxWidth: '500px' }}>Note: you appear to meet the requirements for an Accredited Investor. As of March 15, 2021, Accredited Investors no longer have an investment limit under Reg CF.</div> : ''}
            </div>
        );
    }
}

function App() {
  return (
    <div className="App">
      <RegCFLimitApp />
    </div>
  );
}

export default App;
