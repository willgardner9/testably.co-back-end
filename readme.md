RESOURCES:

Silent refresh blog guide:
    https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/

Fonts:
    https://fonts.google.com/specimen/Inter
    https://fonts.google.com/specimen/Space+Grotesk?category=Sans+Serif&stylecount=4&sort=date&preview.text=Abley&preview.text_type=custom#standard-styles

TODO:

[X] implement refresh token system

[X] create abtest module
    [X] model
    [X] functionality
        [X] create abtest
        [X] read abtest + populate variants
        [X] read abtest by user + populate variants
        [X] update abtest
        [X] delete abtest + delete variants

[X] create variant module
    [X] model
    [X] functionality
        [X] create variant + save to abtest
        [X] read variant
        [X] update variant (public route, accepting session and/or conversion) + no private route to update variant (eg change copy) as variants are immutable
        [X] delete variant + remove from abtest
