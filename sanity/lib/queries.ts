import { defineQuery } from "next-sanity"

export const STARTUPS_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current) && 
    (!defined($search) || title match $search || category match $search || author->name match $search) && 
    (!defined($category) || category == $category)
  ] | order(_createdAt desc){
    _id,
    title,
    slug,
    _createdAt,
    author -> {
        _id, name, image, bio
    },
    views,
    description,
    category,
    image,
    "likes": count(*[_type == "like" && startup._ref == ^._id])
}`)

export const STARTUP_BY_ID_QUERY = defineQuery(`*[_type == "startup" && _id == $id][0]{
      _id,
    title,
    slug,
    _createdAt,
    author -> {
        _id, name,username, image, bio
    },
    views,
    description,
    category,
    image,
    pitch,
    "likes": count(*[_type == "like" && startup._ref == ^._id])
}`)

export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id, views
    }
    `)

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
    *[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
    }
    `)

export const AUTHOR_BY_ID_QUERY = defineQuery(`
    *[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
    }
    `)

export const STARTUPS_BY_AUTHOR_QUERY = defineQuery(`
    *[_type == "startup" && author._ref == $id] | order(_createdAt desc){
    _id,
    title,
    slug,
    _createdAt,
    author -> {
        _id, name, image, bio
    },
    views,
    description,
    category,
    image,
    "likes": count(*[_type == "like" && startup._ref == ^._id])
    }
    `)

export const AUTHOR_STATS_QUERY = defineQuery(`
    *[_type == "author" && _id == $id][0]{
    _id,
    name,
    "totalStartups": count(*[_type == "startup" && author._ref == ^._id]),
    "startups": *[_type == "startup" && author._ref == ^._id]{
        views,
        "likes": count(*[_type == "like" && startup._ref == ^._id])
    },
    "topStartup": *[_type == "startup" && author._ref == ^._id] | order(views desc)[0]{
        _id,
        title,
        views,
        slug
    },
    "mostLikedStartup": *[_type == "startup" && author._ref == ^._id] | order(count(*[_type == "like" && startup._ref == ^._id]) desc)[0]{
        _id,
        title,
        "likes": count(*[_type == "like" && startup._ref == ^._id]),
        slug
    },
    "totalLikes": count(*[_type == "like" && startup->author._ref == ^._id])
    }
    `)

export const LIKE_QUERY = defineQuery(`
    *[_type == "like" && author._ref == $authorId && startup._ref == $startupId][0]{
        _id
    }
    `)

export const LIKES_BY_AUTHOR_QUERY = defineQuery(`
    *[_type == "like" && author._ref == $id] | order(_createdAt desc){
        _id,
        startup->{
            _id,
            title,
            slug,
            _createdAt,
            author->{
                _id, name, image, bio
            },
            views,
            description,
            category,
            image,
            "likes": count(*[_type == "like" && startup._ref == ^._id])
        }
    }
    `)

export const PLAYLIST_BY_SLUG_QUERY = defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    pitch,
    "likes": count(*[_type == "like" && startup._ref == ^._id])
  }
}`)

export const MOST_LIKED_STARTUPS_QUERY = defineQuery(`*[_type == "startup" && defined(slug.current) && count(*[_type == "like" && startup._ref == ^._id]) > 0] | order(count(*[_type == "like" && startup._ref == ^._id]) desc)[0...6]{
    _id,
    title,
    slug,
    _createdAt,
    author -> {
        _id, name, image, bio
    },
    views,
    description,
    category,
    image,
    "likes": count(*[_type == "like" && startup._ref == ^._id])
}`)
