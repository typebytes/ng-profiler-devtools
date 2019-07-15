# Angular change detection profiler

Highlights all components in a Angular app when they are checked during a CD cycle check.

TODO:

- [x] Highlight all components checked
- [x] Make sure it's a runtime thing (which works on any app, even prod builds)
- [ ] Fix the tree rendering
- [ ] Move to chrome plugin-
- [ ] Test on more apps than one :)

## Try it out

Just run
`yarn && yarn start`
to make the app run and start clicking away.

The components will light up. The entire tree of components is rendered below and the tree of components that were updated during the last CD cycle is rendered below that. The tree visualisation should be rendered in the chrome plugin.
