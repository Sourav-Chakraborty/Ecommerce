import { Grid } from '@material-ui/core'
import React, { Component } from 'react'

export default class Test extends Component {
  render() {
    return (
        <div>
            <Grid xs={6} style={{backgroundColor:"skyblue",margin:"30px auto"}}>
              From material ui
              <Grid xs={7} style={{backgroundColor:"yellow"}}>
                        Grid xs=7
                        <Grid xs={8}  style={{backgroundColor:"green"}}>
                            nested grid xs={4}
                        </Grid>
              </Grid>
              <Grid align="right" xs={5} style={{backgroundColor:"violet",float:"right"}}>
                  xs={4}
              </Grid>
            </Grid>


        </div>
    )
  }
}
