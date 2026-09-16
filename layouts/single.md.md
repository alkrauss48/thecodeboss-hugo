{{- /* A clean Markdown sibling for each page, e.g. /2020/09/how-jwts-work/index.md */ -}}
# {{ .Title }}

Source: {{ .Permalink }}
{{ with .Date }}Date: {{ .Format "2006-01-02" }}{{ end }}
{{- with .Params.categories }}
Categories: {{ delimit . ", " }}{{ end }}
{{- with .Params.tags }}
Tags: {{ delimit . ", " }}{{ end }}
{{- with .Description }}

> {{ . | plainify | htmlUnescape }}{{ end }}

{{ .RawContent }}
