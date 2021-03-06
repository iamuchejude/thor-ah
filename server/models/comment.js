module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'comment cannot be empty'
        },
        len: {
          args: [2],
          msg: 'comment cannot be less than two characters long'
        }
      },
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    highlighted: {
      type: DataTypes.TEXT,
    },
    cssId: {
      type: DataTypes.STRING,
    }
  }, {
    hooks: {
      afterSave: (commentData) => {
        const { dataValues } = commentData;
        const { id, body } = dataValues;
        sequelize.models.CommentHistory.create({
          commentBody: body,
          commentId: id,
        });
      },

      beforeUpdate: (commentData) => {
        commentData.isEdited = true;
      }
    }
  });
  Comment.associate = (models) => {
    const {
      User, Article, Reply, CommentLikesDislike, CommentHistory
    } = models;
    Comment.belongsTo(User, {
      onDelete: 'CASCADE',
      as: 'commenter',
    });

    Comment.belongsTo(Article, {
      onDelete: 'CASCADE',
      foreignKey: 'articleId',
      as: 'article'
    });

    Comment.hasMany(Reply, {
      foreignKey: 'commentId',
      // as: 'commentReply'
    });

    Comment.hasMany(CommentLikesDislike, {
      foreignKey: 'commentId',
      as: 'likes',
    });

    Comment.hasMany(CommentLikesDislike, {
      foreignKey: 'commentId',
      as: 'dislikes',
    });

    Comment.hasMany(CommentHistory, {
      foreignKey: 'commentId',
    });
  };
  return Comment;
};
